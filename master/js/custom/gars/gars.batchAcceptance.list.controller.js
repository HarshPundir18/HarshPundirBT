
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garsBatchAcceptanceListController', garsBatchAcceptanceListController);

    garsBatchAcceptanceListController.$inject = ['$state', '$scope', '$compile',
        'spinnerService', 'egarBatchService', 'translationService',
        'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder'];
    function garsBatchAcceptanceListController($state, $scope, $compile,
        spinnerService, egarBatchService, translationService,
        DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

        var vm = this;

        var loadingGifSelector = '#main';

        vm.goToDetail = function(id){
            $state.go('app.batchAcceptanceDetail', { id: id });
        }

        activate();

        ////////////////

        function activate() {
          
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());
            
            vm.dtColumns = [
                DTColumnBuilder
                    .newColumn('DisplayDateTime', 'Data')
                    .notSortable()
                    .withClass('dt-center col-sm-1'),
                DTColumnBuilder.newColumn('UniqueId', 'Lote Id')
                    .notSortable()
                    .withClass('dt-center col-sm-2')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('UserEmail', 'Criado por')
                    .notSortable()
                    .withClass('dt-center col-sm-2')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('TotalNumberOfItems', 'Nº e-GARs')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('Status', 'Estado')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center')
                    .renderWith((val)=> {
                        return translationService.translate(val.toLowerCase());
                    }),
                DTColumnBuilder
                    .newColumn('Actions')
                    .notSortable()
                    .withClass('dt-center action-buttons col-sm-1')
                    .renderWith(renderActions)
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
                            .withOption('ajax', function (dataTable, callback, settings) {
                                spinnerService.show(loadingGifSelector);
                                egarBatchService
                                    .getEgarAcceptanceBatches()
                                    .then(function (result) {
                                        if (result) {
                                            callback(result.data);
                                        }
                                    }, function (error) {

                                    })
                                    .finally(function () {
                                        spinnerService.hide(loadingGifSelector);
                                    });
                            })
                            .withDataProp('data')
                            ;
        }

        function renderActions(establishment, msg, model, cell) {   
            var actionShow = '';
            if(model.IsFinished){
                actionShow = "<span title='Ver' ng-click= vm.goToDetail('" + model.UniqueId + "')><em class='fa fa-eye'></em></span>";
            }
            return actionShow;
        }

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }
    }
})();
