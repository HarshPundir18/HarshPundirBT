(function() {
    'use strict';

    angular
        .module('custom')
        .controller('EgarCreationRulesOverviewController', EgarCreationRulesOverviewController);

        EgarCreationRulesOverviewController.$inject = ['$q', '$window', '$rootScope', '$scope', '$compile', '$http', '$state', '$stateParams', '$location', '$filter',
                                    'garsService', 'spinnerService', 'translationService', 'utilsService', 
                                    'ngDialog', 'localStorageService', 'serviceAreaService', 'egarRulesService',
                                    'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder'];
    function EgarCreationRulesOverviewController($q, $window, $rootScope, $scope, $compile, $http, $state, $stateParams, $location, $filter,
                                    garsService, spinnerService, translationService, utilsService, 
                                    ngDialog, localStorageService, serviceAreaService, egarRulesService,
                                    DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        
        var vm = this;
        vm.dtInstance = {};

        activate();


        function activate() {
          
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());
            
            vm.dtColumns = [

                DTColumnBuilder.newColumn('AccountEstablishment', 'Estabelecimento')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center col-sm-2')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('ServiceAreaCode', 'Área de Serv.')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('ProductGroupCode', 'Grupo Etiq.')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('DestinEstablishment', 'Destino')
                    .notSortable()
                    .withClass('dt-center col-sm-2')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('LerCode1', 'Ler 1')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('LerCode2', 'Ler 2')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('OperationCode', 'Operacão')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center'),
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
                                spinnerService.show('#main');
                                var result = [];
                                angular.element('.tableFilter').each(function(item){  
                                    result.push({
                                        key: this.name,
                                        value: this.value
                                    }) 
                                });

                                egarRulesService.getEgarRulesPage(dataTable.start, dataTable.length, result)
                                    .then(function (result) {
                                        if (result) {
                                            vm.dataTableCurrentStart = result.start;
                                            vm.dataTableCurrentItems = result.data.aaData;
                                            callback(result.data);
                                        }
                                    }, function (error) {

                                    })
                                    .finally(function () {
                                        spinnerService.hide('#main');
                                    });
                            })
                            .withDataProp('data')
                            .withOption('serverSide', true)
                            .withPaginationType('full_numbers')
                            ;
        }

        vm.duplicateActionClick = function(uniqueId){
            $state.go('app.appSettingsEgarCreationRulesDuplicate', { id: uniqueId });
        }

        vm.editActionClick = function(uniqueId){
            $state.go('app.appSettingsEgarCreationRulesEdit', { id: uniqueId });
        }

        vm.deleteActionClick = function (uniqueId) {
            var array = $filter('filter')(vm.dataTableCurrentItems, {'UniqueId': uniqueId});
            if(array && array.length > 0){
                var egarRule = array[0];
                ngDialog.openConfirm({
                    className: 'ngdialog-theme-default',
                    template: '/app/custom/settings/egar-rule-delete-dialog.html',
                    controller: 'EgarRulesDialogController',
                    controllerAs: 'vm',
                    resolve: { 
                        egarRule: function () { return egarRule; }
                    }
                })
                .then(function (value) {
                    console.log('confirmed: ', value);
                    egarRulesService
                        .delete(uniqueId)
                        .then(function(){
                            utilsService.notifySuccess('Regra removida com sucesso!')
                            vm.dtInstance.reloadData(null, true);
                        })
                        .catch(function(){
                            utilsService.notifyWarning('Não foi possível efetuar a operação. <br> Se esta situação persistir por favor contacte o suporte.')
                        });
                })
                .catch(function (reason) {
                    console.log('cancel: ', reason);
                });
            } else{
                utilsService.notifyWarning('Não foi possível efetuar a operação. <br> Se esta situação persistir por favor contacte o suporte.');
            }      
        }

        function renderActions(establishment, msg, model, cell) {   
            var duplicate = `<span title='Duplicar' ng-click=vm.duplicateActionClick('${model.UniqueId}')><em class='fa fa-copy'></em></span>`;
            //var actionShow = "<span title='Ver' ng-click=$ctrl.showActionClick('" + model.UniqueId + "')><em class='fa fa-eye'></em></span>";
            var actionEdit = "<span title='Editar' ng-click=vm.editActionClick('" + model.UniqueId + "')><em class='fa fa-pencil'></em></span>";
            var actionDelete = `<span title='Remover' ng-click=vm.deleteActionClick('${model.UniqueId}')><em class='fa fa-times'></em></span>`;

            return duplicate + actionEdit + actionDelete;
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        vm.onClearFiltersClick = function (){
            angular.element('.tableFilter').each(function(item){ this.value = null; });
            vm.dtInstance.reloadData(null, true);
        }

        vm.onSearchClick = function(){
            vm.dtInstance.reloadData(null, true);
        }
    }
})();
 

