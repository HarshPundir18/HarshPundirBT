
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('ProductGroupListController', ProductGroupListController);

    ProductGroupListController.$inject = ['$scope', '$compile', '$state', 
        'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder', 
        'translationService', 'spinnerService', 'productCodesService', 'utilsService', 'ngDialog'];
    function ProductGroupListController($scope, $compile, $state, 
        DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, 
        translationService, spinnerService, productCodesService, utilsService, ngDialog) {
        let vm = this;
        vm.dtInstance = {};
        vm.pageSize = 10;

        activate();

        function activate() {

            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

            vm.dtColumns = [
                DTColumnBuilder.newColumn('internalCode', 'Código Interno')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('description', 'Designação')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center'),
                DTColumnBuilder
                    .newColumn('Actions')
                    .notSortable()
                    .withClass('dt-center action-buttons')
                    .renderWith(renderActions)
            ];

            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withOption('responsive', true)
                .withOption('bFilter', true)            //show/hide search box
                .withOption('searchDelay', 500)
                .withOption('bLengthChange', false)     //hide change page size
                .withOption('createdRow', createdRow)   //needed to create row/column actions
                .withOption('ajax', getData)
                .withDataProp('data')
                .withOption('serverSide', true)
                .withPaginationType('full_numbers');
        }


        function renderActions(item, msg, model, cell) {   
            var actionShow = '';
            var actionEdit = '';
            var actionDelete = '';

            //var actionShow = "<span title='Ver' ng-click=$ctrl.showActionClick('" + model.UniqueId + "')><em class='fa fa-eye'></em></span>";
             var actionEdit = "<span title='Editar' ng-click=vm.editActionClick('" + model.uniqueId + "')><em class='fa fa-pencil'></em></span>";
             var actionDelete = "<span title='Remover' ng-click=vm.deleteActionClick('" + model.uniqueId + "')><em class='fa fa-times'></em></span>";

            return actionEdit + actionDelete;
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT 
            $compile(angular.element(row).contents())($scope);
        }

        function getData(dataTable, callback, settings) {
            spinnerService.show('.panel-body');
            productCodesService.getProductGroupPage(dataTable.start, dataTable.length, dataTable.search.value)
                .then(function (result) {
                    if (result) {
                        var items = result.data.aaData.map(function(item) {
                            return { 
                                uniqueId: item.UniqueId,
                                internalCode: item.InternalCode,
                                description: item.Description,
                            };
                        });
                        // vm.dataTableCurrentStart = result.data.start;
                        vm.dataTableCurrentItems = items;
                        result.data.aaData = items;

                        callback(result.data);
                    }
                }, function (error) {

                })
                .finally(function () {
                    spinnerService.hide('.panel-body');
                });
        }

        vm.editActionClick = function(uniqueId){
            $state.go('app.productGroup', {id: uniqueId})
        }

        // vm.deleteActionClick = function(uniqueId){
        //     vm.itemToDelete = vm.dataTableCurrentItems.filter(function(item) {
        //         return item.uniqueId === uniqueId;
        //     })[0];

        //     //show modal
        //     vm.dialog = ngDialog.open({
        //         template: '/app/custom/productCodes/productCodes.delete.dialog.html',
        //         className: 'ngdialog-theme-default',
        //         preCloseCallback: preCloseCallback,
        //         width: 900,
        //         showClose: true,
        //         controller: 'ProductsListController as $ctrl',
        //         scope: $scope,
        //         closeByNavigation: true,
        //     });
        // }

        var preCloseCallback = (payload) =>{    
            if(payload){
                productCodesService
                    .delete(vm.itemToDelete.uniqueId)    
                    .then(onDeleteSuccess)
                    .catch(onDeleteError);
            }

            return true;
        }

        function onDeleteSuccess(result){
            vm.dtInstance.reloadData(null, true);
            utilsService.notifySuccess('Etiqueta eliminada com sucesso!')
        }

        function onDeleteError(error){
            utilsService.notifyError('Não foi possível eliminar a Etiqueta. <br> Se esta situação persistir por favor contacte o suporte.');        
        }
    }
})();

