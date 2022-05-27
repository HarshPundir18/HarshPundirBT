(function() {
    'use strict';

    angular
        .module('custom')
        .controller('establishmentsTableController', establishmentsTableController);

    establishmentsTableController.$inject = ['$scope', '$compile', '$log', '$http', '$state', '$filter', 'ngDialog',
                                    'establishmentService', 'spinnerService', 'translationService', 'Notify',
                                    'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder'];
    function establishmentsTableController($scope, $compile, $log, $http, $state, $filter, ngDialog,
                                    establishmentService, spinnerService, translationService, Notify,
                                    DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        var vm = this;
        console.log('establishmentsTableController');
        vm.dataTableCurrentStart = null;
        vm.dtInstance = {};
        vm.btnOriginSelected  = false;
        vm.btnTransporterSelected = false;
        vm.btnDestinSelected = true;

        vm.pageSize = 10;

        activate();

        ////////////////

        function activate() {
            
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

            vm.dtColumns = [
                DTColumnBuilder.newColumn('Name', 'Estabelecimento')
                    .notSortable() 
                    .withClass('sorting_disabled')
                    .withClass('dt-center col-sm-2'),
               DTColumnBuilder.newColumn('Address.DisplayAddress', 'Morada')
                    .notSortable() 
                    .withClass('sorting_disabled')
                    .withClass('dt-center col-sm-2'), 
                DTColumnBuilder.newColumn('Vat', 'Nif')
                    .notSortable()
                    .withClass('dt-center col-sm-1'),
                DTColumnBuilder.newColumn('ApaCode', 'Código APA')
                    .notSortable()
                    .withClass('dt-center col-sm-1'),
                DTColumnBuilder.newColumn('Email', 'e-Mail')
                    .notSortable()
                    .withClass('dt-center col-sm-1'),
                DTColumnBuilder.newColumn('Phone', 'Telf.')
                    .notSortable()
                    .withClass('dt-center col-sm-1'),
                DTColumnBuilder.newColumn('Mobile', 'Tlm.')
                    .notSortable()
                    .withClass('dt-center col-sm-1'),
                DTColumnBuilder.newColumn('ExternalId', 'ID Interno')
                    .notSortable()
                    .withClass('dt-center col-sm-1'),
                DTColumnBuilder.newColumn('HasAccess', 'Acesso SILIAMB')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .renderWith(renderHasAccess),
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
                .withOption('ajax', function(dataTable, callback, settings) {
                    var firstPage = dataTable.start != vm.dataTableCurrentStart;
                    var noSearch = dataTable.search.value == '';
                    var hasValidSearch = dataTable.search && dataTable.search.value &&  dataTable.search.value.length > 2;
                    
                    spinnerService.show('#main');
                    var searchItems = [];
                    angular.element('.tableFilter').each(function(item){  
                        searchItems.push({
                            key: this.name,
                            value: this.value
                        }) 
                    });

                    establishmentService
                        .getEstablishmentsPage(dataTable.start, dataTable.length, searchItems)
                        .then(function(result) {
                            if(result){
                                vm.dataTableCurrentStart = result.start;
                                vm.dataTableCurrentItems = result.data.aaData;
                                vm.canEditClientEstablishments = result.data.canEditUserEstablishments;
                                callback(result.data);
                            }
                        }, function(error){

                        })
                        .finally(function(){
                            spinnerService.hide('#main');
                        });
                })
                .withDataProp('data')
                //.withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers');
        }
        
        vm.onClearFiltersClick = function(){
            angular.element('.tableFilter').each(function(item){ this.value = null; });
            vm.dtInstance.reloadData(null, true);
        }

        vm.onSearchClick = function(){
            vm.dtInstance.reloadData(null, true);
        }

        function renderHasAccess(hasAccess){
            var title = hasAccess ? 'Acesso configurado' : 'Sem acesso configurado'; 
            var icon = hasAccess ? 'fa fa-check-square-o' : 'fa fa-square-o';
            return '<span title="' + title + '"><em class="' + icon + '"></em></span>';
        }

        function renderActions(establishment, msg, model, cell){
            var actionShow = '';
            var actionEdit = '';
            var actionDelete = '';

            if(vm.canEditClientEstablishments){
                actionShow = "<span title='Ver' ng-click=$ctrl.showActionClick('" + model.UniqueId + "')><em class='fa fa-eye'></em></span>";
                actionEdit = "<span title='Editar' ng-click=$ctrl.editActionClick('" + model.UniqueId + "')><em class='fa fa-pencil'></em></span>";
                actionDelete = "<span title='Remover' ng-click=$ctrl.deleteActionClick('" + model.UniqueId + "')><em class='fa fa-times'></em></span>";    
            }
            
            return actionEdit + actionDelete;
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT 
            $compile(angular.element(row).contents())($scope);
        }

        function buildFetchUrl(dataTable){
            var searchTerm = null;
            if(dataTable.search && dataTable.search.value &&  dataTable.search.value.length > 2){
                searchTerm = '&searchTerm=' + dataTable.search.value;
            }else{
                searchTerm = '';
            }

            var fetchUrl = window.appSettings.apiHost + '/api/establishments?start=' + dataTable.start + '&pageSize=' + dataTable.length + searchTerm;     

            return fetchUrl;   
        }

        

        function establishmentDeleteOnSuccess(result){
            vm.dtInstance.reloadData(null, true);
            Notify.alert( 
                    '<em class="fa fa-check"></em> Estabelecimento cliente apagado com sucesso!', 
                    { status: 'success'}
                );
        }

        function establishmentDeleteOnError(error){
            Notify.alert( 
                    '<em class="fa fa-times"></em> Não foi possivel agar Estabelecimento cliente, por favor tente novamente.', 
                    { status: 'warning'}
                );
        }

        vm.showActionClick = function(establishmentId){
            $log.info('showActionClick ' + establishmentId);
        }

        vm.editActionClick = function(establishmentId){
            $state.go('app.establishmentEdit', {establishmentId: establishmentId})
        }

        vm.deleteActionClick = function(establishmentId){
            var establishment = $filter('filter')(vm.dataTableCurrentItems, {'UniqueId': establishmentId})[0];

            if(!establishment){
                return;
            }

            ngDialog.openConfirm({
                template: 'diag-establishmentDelete',
                className: 'ngdialog-theme-default',
                controller: 'establishmentDialogController',
                resolve : {
                    establishment: function (){ return establishment; }
                }
            })
            .then(function (value) {
                  console.log('Modal promise resolved SUCCESS. Value: ', value);
                  establishmentService.deleteEstablishment(establishmentId).then(establishmentDeleteOnSuccess, establishmentDeleteOnError);
                }, function (reason) {
                  console.log('Modal promise rejected CANCELEd. Reason: ', reason);
            });
        }
    }
})();
 