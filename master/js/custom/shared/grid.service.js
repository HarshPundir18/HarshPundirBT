(function(){
    'use strict';

    angular
        .module('custom')
        .service('gridService', gridService);

    function gridService ($timeout, uiGridConstants) {

        this.create = function(options){

            if (options === null) {
                throw new Error('Options are required.');
            }

            if (!options.hasOwnProperty('scope')) {
                throw new Error('Scope is required.');
            }

            if (!options.dataObject) {
                throw new Error('Need parent object to select data with.');
            }

            if (typeof options.getData !== 'function') {
                throw new Error('Need function to retrieve data with.');
            }

            var scope = options.scope;
            var filterBulkAction = options.filterBulkAction;
            var firstPage = 0;
            var gridApi = {};
            var lastPage = 0;
            var page = 0;
            var pageCount = 0;
            var pageSize = 20;
            var totalCount = 0;
            var sort = {};
            var response = {
                gridOptions: {},
                gridApi: {},
                refresh: function() {
                    page = 0;
                    getFirstData();
                },
                reloadFromRows: function(rows) {

                    rows.forEach(function(row) {
                        var currentRowIndex = gridOptions.data.indexOf(row.entity);
                        gridOptions.data.splice(currentRowIndex, 1);
                    });

                    var items = rows.length;
                    var offset =  ((lastPage + 1)* pageSize) - items;
                    getData(true, offset, items, getFilters(), sort);
                },
                refreshSelection: function() {
                    if ( !!gridApi.selection ) {
                        gridApi.selection.raise.rowSelectionChanged();
                    }
                },
                toggleOpenedInViewer: function(rowentity) {

                    if( rowentity === false ) {
                        scope.lastOpenedDocument.openedInViewer = false;
                        return;
                    }

                    scope.lastOpenedDocument.openedInViewer = false;
                    rowentity.openedInViewer = true;
                    scope.lastOpenedDocument = rowentity;
                }
            };

            /* configure grid options */
            var gridOptions = {
                flatEntityAccess: true,
                fastWatch: true,
                enableCellEditOnFocus: false,
                enableSorting: true,
                showFilter: false,
                enableRowSelection: true,
                enableCellSelection: true,
                enableRowHeaderSelection: false,
                showSelectionCheckbox: true,
                enableSelectAll: true,
                modifierKeysToMultiSelect: true,
                selectionRowHeaderWidth: 25,
                infiniteScrollPercentage: 15,
                rowHeight: 55,
                infiniteScrollRowsFromEnd: 10,
                infiniteScrollUp: true,
                infiniteScrollDown: true,
                columnDefs: options.columnDefs,
                onRegisterApi: function(gridApiCaller){
                    response.gridApi = gridApiCaller;
                    gridApi = gridApiCaller;
                    gridApi.infiniteScroll.on.needLoadMoreData(scope, getDataDown);

                    if( !!gridApi.selection ) {
                        gridApi.selection.on.rowSelectionChanged(scope, function(){
                            onRowSelectionChange(gridApi.selection.getSelectedGridRows());
                        });
                        gridApi.selection.on.rowSelectionChangedBatch(scope, function(){
                            onRowSelectionChange(gridApi.selection.getSelectedGridRows());
                        });
                    }

                    gridApi.infiniteScroll.saveScrollPercentage();
                    gridApi.core.refresh();

                    gridApi.core.on.scrollEnd(scope, function (scrollhandle) {
                        // this is a bug fix based on ui-grid source code:
                        // https://github.com/angular-ui/ui-grid/blob/aa7ab654a42eadfd69061707d01cf0d0d09ad590/src/features/infinite-scroll/js/infinite-scroll.js
                        if ( scrollhandle.grid.infiniteScroll && scrollhandle.grid.infiniteScroll.dataLoading || scrollhandle.source === 'ui.grid.adjustInfiniteScrollPosition' ){
                          return;
                        }

                        if (scrollhandle.grid.infiniteScroll.direction === uiGridConstants.scrollDirection.UP && page > 0) {
                            gridApi.infiniteScroll.raise.needLoadMoreDataTop();

                        } else if(scrollhandle.grid.infiniteScroll.direction === uiGridConstants.scrollDirection.DOWN && page < pageCount-1) {
                            gridApi.infiniteScroll.raise.needLoadMoreData();
                        }
                    });

                    gridApi.core.on.filterChanged(scope, function() {
                        response.refresh();
                    });

                    gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {

                        delete sort.field;
                        delete sort.direction;

                        if (sortColumns.length > 0) {
                          var sortColumn = sortColumns[0];

                          sort = {
                            field: sortColumn.field,
                            direction: sortColumn.sort.direction
                          };
                        }

                        response.refresh();
                    });
                }
            };

            angular.extend(gridOptions, options.gridOptions);

            // delete non null sort direction
            // http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef
            gridOptions.columnDefs.forEach(function(columnDef) {
              columnDef.sortDirectionCycle = [uiGridConstants.ASC, uiGridConstants.DESC];
            });

            function getDataDown() {
                if (page >= pageCount-1) {
                    return;
                }

               page++;
               lastPage++;
               return getData(true, pageSize * page, pageSize, getFilters(), sort);
            }

            function getDataUp() {
                if (page === 0) {
                    return;
                }

               page--;
               firstPage--;
               return getData(false, pageSize * page, pageSize, getFilters(), sort);
            }

            scope.$on('activeCompanyChanged', function (event, companyId) {
                    getFirstData();
            });

            var onRowSelectionChange = function(selectedRows) {

                if (!options.onRowSelectionChange) {
                  return;
                }

                return options.onRowSelectionChange(selectedRows);
            };

            var getData = function(getNextPage, offset, limit, filters, sort) {
                var getPage = function(addToBottom) {
                    var pageToRequest = (addToBottom ? lastPage : firstPage);
                    return options.getData(offset, limit, filters, sort)
                        .success(function(data) {
                            gridApi.infiniteScroll.saveScrollPercentage();
                            if (data[options.dataObject] !== null) {
                                if(addToBottom) {
                                    gridOptions.data = gridOptions.data.concat(data[options.dataObject]);
                                }
                                else {
                                    gridOptions.data = data.documents.concat(gridOptions.data);
                                }

                                if (gridApi.selection && gridApi.selection.raise)
                                {
                                    gridApi.selection.raise.rowSelectionChanged();
                                }
                            }
                        })
                        .error(function(){
                            throw new Error('gridService.getData failed');
                        });
                };

                var checkPosition = function() {
                    return  gridApi.infiniteScroll.dataLoaded(firstPage > 0, lastPage < pageCount);
                };

                return getPage(getNextPage)
                    .then(checkPosition)
                    .catch(function(error) {
                        gridApi.infiniteScroll.dataLoaded();
                    });
            };

            function getFilters() {

              if (!gridApi || !gridApi.grid) {
                return [];
              }

              var filters = gridApi.grid.columns.filter(function(column) {

                if (column.filters && column.filters[0] && column.filters[0].term) {
                  return true;
                }

                return false;
              })
              .map(function(column) {
                  return { field: column.field, text: column.filters[0].term };
              });

              return filters;
            }

            function getFirstData() {

                gridOptions.data = [];

                return options.getData(0, pageSize, getFilters(), sort)
                    .success(function(data) {

                        if (data[options.dataObject] !== null) {
                            gridOptions.data = data[options.dataObject];
                            if(data.totalCount > pageSize) {
                                pageCount = Math.ceil(data.totalCount / pageSize);
                            } else {
                                pageCount = 1;
                            }

                            lastPage = 0;
                            firstPage = 0;

                            if (gridApi.selection && gridApi.selection.raise)
                            {
                                gridApi.selection.raise.rowSelectionChanged();
                            }
                        }
                    })
                    .then(function(){
                        $timeout(function() {
                            // timeout needed to allow digest cycle to complete,and grid to finish ingesting the data
                            // you need to call resetData once you've loaded your data if you want to enable scroll up,
                            // it adjusts the scroll position down one pixel so that we can generate scroll up events
                            gridApi.infiniteScroll.resetScroll(firstPage > 0, lastPage < pageCount );
                            gridApi.infiniteScroll.dataLoaded(false,  pageCount > 1);
                        });
                    });
            }

            getFirstData();

            response.gridOptions = gridOptions;

            return response;
        };
    }
})();
