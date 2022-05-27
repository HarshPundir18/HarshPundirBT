(function() {
    'use strict';

    angular
        .module('custom')
        .controller('PickupPointsListController', PickupPointsListController);

    PickupPointsListController.$inject = ['$scope', '$compile', '$state', 'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder', 
        'translationService', 'spinnerService', 'pickupPointsService', 'utilsService', 'ngDialog'];
    function PickupPointsListController($scope, $compile, $state, DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, 
        translationService, spinnerService, pickupPointsService, utilsService, ngDialog) {
        let vm = this;
        var loadigGifSelector = '#pickupPointsList';
        vm.dtInstance = {};
        vm.pageSize = 10;
        vm.filters = {
            internalCode: null,
            apaCode: null,
            name: null
        }

        activate();

        function activate() {

            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

            vm.dtColumns = [
                DTColumnBuilder.newColumn('description', 'Nome')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('pickupPointVat', 'NIF')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('address', 'Morada')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('internalCode', 'Código Interno')
                    .notSortable()
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('apaCode', 'Código APA')
                    .notSortable()
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('type', 'Tipo')
                    .notSortable()
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

        vm.onClearFiltersClick = function(){
            vm.filters.internalCode = null;
            vm.filters.apaCode = null;
            vm.filters.name = null;
            vm.dtInstance.reloadData(null, true);
        }

        vm.onSearchClick = function(){
            vm.dtInstance.reloadData(null, true);
        }

        function renderActions(item, msg, model, cell) {   
            var actionShow = '';
            var actionEdit = '';
            var actionDelete = '';

            if(!model.IsDefault){
                //var actionShow = "<span title='Ver' ng-click=$ctrl.showActionClick('" + model.UniqueId + "')><em class='fa fa-eye'></em></span>";
                var actionEdit = "<span title='Editar' ng-click=vm.editActionClick('" + model.uniqueId + "')><em class='fa fa-pencil'></em></span>";
                var actionDelete = "<span title='Remover' ng-click=vm.deleteActionClick('" + model.uniqueId + "')><em class='fa fa-times'></em></span>";
            }

            return actionEdit + actionDelete;
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT 
            $compile(angular.element(row).contents())($scope);
        }

        function getData(dataTable, callback, settings) {
            spinnerService.show(loadigGifSelector);
            pickupPointsService.getPickupPointsPage(dataTable.start, dataTable.length, vm.filters.internalCode, vm.filters.apaCode, vm.filters.name)
                .then(function (result) {
                    if (result) {
                        vm.dataTableCurrentStart = result.start;
                        var items = result.data.aaData.map(function(item) {
                            return { 
                                uniqueId: item.UniqueId,
                                address: `${item.Address} ${item.PostalCode} ${item.Local}`, 
                                email: item.Email,
                                pickupPointVat: item.PickupPointVat,
                                internalCode: item.InternalCode,
                                description: item.Description,
                                apaCode: item.ApaCode,
                                type: item.PickupPointType,
                            };
                        });
                        vm.dataTableCurrentItems = items;
                        result.data.aaData = items;

                        callback(result.data);
                    }
                }, function (error) {

                })
                .finally(function () {
                    spinnerService.hide(loadigGifSelector);
                });
        }

        vm.editActionClick = function(uniqueId){
            $state.go('app.pickupPointsEdit', {id: uniqueId})
        }

        vm.deleteActionClick = function(uniqueId){
            vm.pickupPoint = vm.dataTableCurrentItems.filter(function(pickupPoint) {
                return pickupPoint.uniqueId === uniqueId;
            })[0];

            //show modal
            vm.dialog = ngDialog.open({
                template: '/app/custom/pickupPoints/pickupPoints.delete.dialog.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: preCloseCallback,
                width: 900,
                showClose: true,
                controller: 'PickupPointsListController as $ctrl',
                scope: $scope,
                closeByNavigation: true,
            });
        }

        var preCloseCallback = (payload) =>{    
            if(payload){
                pickupPointsService
                    .deletePickupPoint(vm.pickupPoint.uniqueId)    
                    .then(onPickupPointDeleteSuccess)
                    .catch(onPickupPointDeleteError);
            }

            return true;
        }

        function onPickupPointDeleteSuccess(result){
            vm.dtInstance.reloadData(null, true);
            utilsService.notifySuccess('Ponto de recolha eliminado com sucesso!')
        }

        function onPickupPointDeleteError(error){
            utilsService.notifyError('Não foi possível eliminar o Ponto de recolha. <br> Se esta situação persistir por favor contacte o suporte.');        
        }
    }
})();

