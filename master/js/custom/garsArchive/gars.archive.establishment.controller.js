(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garsArchiveEstablishmentController', garsArchiveEstablishmentController);

    garsArchiveEstablishmentController.$inject = ['$scope', '$state', '$stateParams', '$compile', '$q', '$http',
        'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder',
        'browserService',
        'garArchiveService', 'spinnerService', 'translationService', 'utilsService', 'ngDialog'];
    function garsArchiveEstablishmentController($scope, $state, $stateParams, $compile, $q, $http,
        DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder,
        browserService,
        garArchiveService, spinnerService, translationService, utilsService, ngDialog) {

        //VM stuff
        var vm = this;

        vm.dtInstance = {};
        vm.pageSize = 10;

        vm.year = $stateParams.year;
        vm.establishmentId = $stateParams.establishmentId;

        activate();

        function activate() {
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

            vm.dtColumns = [
                DTColumnBuilder.newColumn('externalNumber', 'Número')
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

        vm.downloadActionClick = function (garArchiveId) {
            if(browserService.ie()){
                alert('O Internet Explorer não suporta esta operação! \n Por favor tente com Chrome, Firefox ou Edge.');
                return;
            }

            spinnerService.show('.panel-body');
            garArchiveService
                .downloadFile(garArchiveId)
                .then(function(result){
                    //utilsService.notifySuccess('Certificado emitido com sucesso');
                })
                .catch(function(error){
                    utilsService.notifyError('Não foi possível fazer o download do ficheiro. <br> Se esta situação persistir por favor contacte o suporte.');
                })
                .finally(function(){
                    spinnerService.hide('.panel-body');
                });
        }


        function preClose(a, b) {
            console.log('preClose');
        }

        function getData(dataTable, callback, settings) {
            spinnerService.show('.panel-body');
            
            garArchiveService.getGarArchivePage(vm.establishmentId, dataTable)
                .then(function (result) {
                    if (result) {
                        vm.dataTableCurrentStart = result.start;
                        var items = result.data.aaData.map(function(item) {
                            return {
                                uniqueId: item.UniqueId,
                                externalNumber: item.ExternalNumber,
                            };
                        });
                        vm.dataTableCurrentItems = items;
                        result.data.aaData = items;

                        callback(result.data);
                    }
                }, function (error) {
                    utilsService.notifyError('Não foi possível realizar a operação. <br> Se esta situação persistir por favor contacte o suporte.'); 
                })
                .finally(function () {
                    spinnerService.hide('.panel-body');
                });
        }

        function renderActions(item, msg, model, cell) {
            var actionDownload = "<span title='Download' ng-click=vm.downloadActionClick('" + model.uniqueId + "')><em class='fa fa-download'></em></span>";
            return actionDownload;
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        //SCOPE stuff
    }
})();