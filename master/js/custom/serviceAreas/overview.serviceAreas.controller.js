(function () {
    'use strict';

    angular
        .module('custom')
        .controller('OverviewServiceAreasController', OverviewServiceAreasController);

    OverviewServiceAreasController.$inject = ['$scope', '$compile', '$state', '$filter', 'ngDialog',
        'serviceAreaService', 'spinnerService', 'translationService', 'utilsService',
        'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder'];
    function OverviewServiceAreasController($scope, $compile, $state, $filter, ngDialog,
        serviceAreaService, spinnerService, translationService, utilsService,
        DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder) {

        var vm = this;
        vm.filters = {
            internalCode: null,
            description: null,
            assignedTo: null
        };
        vm.dataTableCurrentStart = null;
        vm.dtInstance = {};
        vm.btnOriginSelected = false;
        vm.btnTransporterSelected = false;
        vm.btnDestinSelected = true;

        vm.pageSize = 10;

        vm.editActionClick = function (id) {
            $state.go('app.serviceArea', { id: id })
        }

        vm.deleteActionClick = function (uniqueId) {
            var serviceAreaArray = $filter('filter')(vm.dataTableCurrentItems, {'UniqueId': uniqueId});
            if(serviceAreaArray && serviceAreaArray.length > 0){
                var serviceArea = serviceAreaArray[0];
                ngDialog.openConfirm({
                    className: 'ngdialog-theme-default',
                    template: '/app/custom/service-areas/service-area-delete-dialog.html',
                    controller: 'ServiceAreaDialogController',
                    controllerAs: 'vm',
                    resolve: { 
                        serviceArea: function () { return serviceArea; }
                    }
                })
                .then(function (value) {
                    console.log('confirmed: ', value);
                    serviceAreaService
                        .delete(uniqueId)
                        .then(utilsService.notifySuccess('Área de Serviço removida com sucesso!'))
                        .catch(utilsService.notifyWarning('Não foi possível efetuar a operação. <br> Se esta situação persistir por favor contacte o suporte.'));
                })
                .catch(function (reason) {
                    console.log('cancel: ', reason);
                });
            } else{
                utilsService.notifyWarning('Não foi possível efetuar a operação. <br> Se esta situação persistir por favor contacte o suporte.');
            }
            
        }

        ////////////////
        activate() ;

        function activate() {
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

            vm.dtColumns = [
                DTColumnBuilder.newColumn('InternalCode', 'Código Interno')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center col-sm-2'),
                DTColumnBuilder.newColumn('Description', 'Descrição')
                    .notSortable()
                    .withClass('dt-center col-sm-1'),
                DTColumnBuilder.newColumn('AssignedToUserName', 'Assignada a')
                    .notSortable()
                    .withClass('dt-center col-sm-1'),
                DTColumnBuilder
                    .newColumn('Actions')
                    .notSortable()
                    .withClass('dt-center action-buttons col-sm-1')
                    .renderWith(renderActions)
            ];

            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withOption('responsive', true)
                .withOption('bFilter', false)            //show/hide search box
                .withOption('searchDelay', 500)
                .withOption('bLengthChange', false)     //hide change page size
                .withOption('createdRow', createdRow)   //needed to create row/column actions
                .withOption('ajax', function (dataTable, callback, settings) {
                    spinnerService.show('.panel-body');
                    
//                     var searchItems = [];
//                     angular.element('.tableFilter').each(function(item){  
//                         searchItems.push({
//                             key: this.name,
//                             value: this.value
//                         }) 
//                     });

                    var filtersArray = [
                        { key: 'internalCode', value: vm.filters.internalCode }, 
                        { key: 'description', value: vm.filters.description}, 
                        { key: 'assignedTo', value: vm.filters.assignedTo ? vm.filters.assignedTo.key : null }
                    ];
                

                    serviceAreaService.getServiceAreas(dataTable.start, dataTable.length, filtersArray)
                        .then(function (result) {
                            if (result) {
                                vm.dataTableCurrentStart = result.start;
                                vm.dataTableCurrentItems = result.data.aaData;
                                callback(result.data);
                            }
                        }, function (error) {

                        })
                        .finally(function () {
                            spinnerService.hide('.panel-body');
                        });
                })
                .withDataProp('data')
                .withOption('serverSide', true)
                .withPaginationType('full_numbers');
        }

        vm.onClearFiltersClick = function(){
            vm.filters.internalCode = null;
            vm.filters.description = null;
            vm.filters.assignedTo = null;
            vm.dtInstance.reloadData(null, true);
        }

        vm.onSearchClick = function(){
            vm.dtInstance.reloadData(null, true);
        }

        vm.onSelectedUserChange = function(obj){
            console.log(obj);
        }

        function renderActions(establishment, msg, model, cell) {   
            var actionShow = '';
            var actionEdit = '';
            var actionDelete = '';

            if(!model.IsDefault){
                //var actionShow = "<span title='Ver' ng-click=$ctrl.showActionClick('" + model.UniqueId + "')><em class='fa fa-eye'></em></span>";
                var actionEdit = "<span title='Editar' ng-click=vm.editActionClick('" + model.UniqueId + "')><em class='fa fa-pencil'></em></span>";
                var actionDelete = `<span title='Remover' ng-click=vm.deleteActionClick('${model.UniqueId}')><em class='fa fa-times'></em></span>`;
            }

            return actionEdit + actionDelete;
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT 
            $compile(angular.element(row).contents())($scope);
        }
    }
})();
