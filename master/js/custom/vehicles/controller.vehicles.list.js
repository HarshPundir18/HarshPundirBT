
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('VehiclesListController', VehiclesListController);

    VehiclesListController.$inject = ['$scope', '$compile', '$state', 'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder', 
        'translationService', 'spinnerService', 'vehiclesService', 'utilsService', 'ngDialog'];
    function VehiclesListController($scope, $compile, $state, DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, 
        translationService, spinnerService, vehiclesService, utilsService, ngDialog) {

        let vm = this;
        vm.dtInstance = {};
        vm.pageSize = 10;
        
        
        const spinnerSelector = '#vehicles';

        activate();

        function activate() {
            initializeFilters();

            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

            vm.dtColumns = [
                DTColumnBuilder.newColumn('registration', 'Matrícula')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('description', 'Descrição')
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
                .withOption('bFilter', false)            //show/hide search box
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
            spinnerService.show(spinnerSelector);
            vehiclesService.getPage(dataTable.start, dataTable.length, vm.registration, vm.assignedTo)
                .then(function (result) {
                    if (result) {
                        vm.dataTableCurrentStart = result.start;
                        var items = result.data.aaData.map(function(item) {
                            return { 
                                uniqueId: item.UniqueId,
                                description: item.Description,
                                registration: item.Registration,
                            };
                        });
                        vm.dataTableCurrentItems = items;
                        result.data.aaData = items;

                        callback(result.data);
                    }
                }, function (error) {

                })
                .finally(function () {
                    spinnerService.hide(spinnerSelector);
                });
        }

        function initializeFilters(){
            vm.filters = {
                assignedTo: null,
                registration: null
            }
        }

        vm.editActionClick = function(uniqueId){
            $state.go('app.vehiclesEdit', {id: uniqueId})
        }

        vm.deleteActionClick = function(uniqueId){
            console.log('deleteActionClick')
            vm.itemToDelete = vm.dataTableCurrentItems.filter(function(item) {
                return item.uniqueId === uniqueId;
            })[0];

            //show modal
            vm.dialog = ngDialog.open({
                template: '/app/custom/vehicles/vehicles.delete.dialog.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: preCloseCallback,
                width: 900,
                showClose: true,
                controller: 'VehicleDeleteController as vm',
                scope: $scope,
                closeByNavigation: true,
                resolve : {
                    vehicle: ()=>{ return vm.itemToDelete; }
                }
            });
        }

        vm.onClearSearchClick = function(){
            initializeFilters();
            vm.onSearchClick();
        }

        vm.onSearchClick = function(){     
            vm.registration = vm.filters.registration;
            vm.assignedTo =  vm.filters.assignedTo ? vm.filters.assignedTo.key : null;

            vm.dtInstance.reloadData(null, true);
        }

        var preCloseCallback = (payload) =>{    
            if(payload === true){
                vehiclesService
                    .delete(vm.itemToDelete.uniqueId)    
                    .then(onDeleteSuccess)
                    .catch(onDeleteError);
            }

            return true;
        }

        function onDeleteSuccess(result){
            vm.dtInstance.reloadData(null, true);
            utilsService.notifySuccess('Veículo eliminado com sucesso!')
        }

        function onDeleteError(error){
            if(error.status === 400){
                utilsService.parseAndNotifyApplicationErrors(error.data._applicationErrors);
                return;
            }

            //500
            utilsService.notifyError('Não foi possível eliminar o Veículo. <br> Se esta situação persistir por favor contacte o suporte.');        
        }
    }
})();

