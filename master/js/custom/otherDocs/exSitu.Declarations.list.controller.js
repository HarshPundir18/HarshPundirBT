
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('exSituDeclarationsListController', exSituDeclarationsListController);

        exSituDeclarationsListController.$inject = ['$state', '$scope', '$compile', '$timeout',
        'spinnerService', 'translationService', 'otherDocsService', 'dateService',
        'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder'];
    function exSituDeclarationsListController($state, $scope, $compile, $timeout,
        spinnerService, translationService, otherDocsService, dateService,
        DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder) {

        var vm = this;
        vm.items = [];
        vm.dtInstance = null;
        vm.progressBar = [];
        vm.number = 10;
        var loadingGifSelector = '#main';

        var loadTime = 5000, //Load the data every miliseconds
        errorCount = 0, //Counter for the server errors
        loadPromise; //Pointer to the promise created by the Angular $timout service

        activate();

        vm.goToDetail = function(id){
            $state.go('app.generatedDocumentsExSituDeclarationDetails', { requestId: id })
        }

        ////////////////

        function activate() {
          
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());
            
            vm.dtColumns = [
                DTColumnBuilder.newColumn('rowKey', 'Lote Id')
                    .notSortable()
                    .withClass('dt-center col-sm-2'),
                DTColumnBuilder
                    .newColumn('timestamp', 'Data')
                    .notSortable()
                    .withClass('dt-center col-sm-2')
                    .renderWith((actions, msg, model, cell)=> {
                        return dateService.toFormatedString(new Date(model.timestamp));
                    }),
                DTColumnBuilder.newColumn('Progress', 'Progresso')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center')
                    .renderWith((actions, msg, model, cell)=> {
                        setProgressBarValues(model);
                        if(model.CompletedItems == 0){
                            return '<span>Em fila...</span>';
                        }
                        else if(model.CompletedItems == model.TotalItems){
                            return "<button  type='submit' class='btn btn-labeled btn-success' ng-click=vm.goToDetail('" + model.rowKey + "')>Terminado</button>";
                        }
                        else{
                            return '<progress value="' + vm.progressBar[model.rowKey].completedItems + '" max="' + vm.progressBar[model.rowKey].totalItems + '"></progress>';
                        }
                    })
            ];

            vm.dtOptions = DTOptionsBuilder
                            .newOptions()
                            .withOption('headerCallback', function(thead, data, start, end, display){ })
                            .withOption('footerCallback', function(tfoot, data, start, end, display){ })
                            .withOption('responsive', true)
                            .withOption('bFilter', false)            //show/hide search box
                            .withOption('searchDelay', 500)
                            .withOption('paging', false)
                            .withOption('bLengthChange', false)     //hide change page size
                            .withOption('createdRow', createdRow)   //needed to create row/column actions
                            .withOption('serverSide', true)
                            .withOption('ajax', getData)
                            .withDataProp('data')
                            ;
        }

        function reloadDatatable(){
            vm.dtInstance.reloadData(null, true);
        }

        function getData(dataTable, callback, settings) {
            spinnerService.show(loadingGifSelector);
            otherDocsService
                .getGeneratedDocuments()
                .then(function (result) {
                    if (result) {
                        callback(result.data);
                    }
                }, function (error) {

                })
                .finally(function () {
                    spinnerService.hide(loadingGifSelector);
                    nextLoad();
                });
        };

        var nextLoad = function(mill) {
            mill = mill || loadTime;
            //Always make sure the last timeout is cleared before starting a new one
            cancelNextLoad();
            loadPromise = $timeout(getProgress, mill);
        };

        var cancelNextLoad = function() {
            $timeout.cancel(loadPromise);
        };
          

        var getProgress = function() {
            otherDocsService
            .getGeneratedDocuments()
            .then(function (result) {
                if (result) {
                    reloadDatatable();
                }
                nextLoad();
            }, function (error) {
                //TODO: maybe implement exponetial retry
                cancelNextLoad();
            })
            .finally(function () {
                spinnerService.hide(loadingGifSelector);
            });
        }

        function setProgressBarValues(obj){
            vm.progressBar[obj.rowKey] = {
                totalItems: obj.TotalItems,
                completedItems: obj.CompletedItems
            }
        }


        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }


        $scope.$on('$destroy', function() {
            cancelNextLoad();
            console.log('destroy');
          });
        
    }
})();
