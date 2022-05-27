(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garsBatchAcceptanceDetailController', garsBatchAcceptanceDetailController);

        garsBatchAcceptanceDetailController.$inject = ['$state', '$stateParams', '$log', '$compile', '$scope',
        'spinnerService', 'egarBatchService', 'translationService',
        'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder'];
    function garsBatchAcceptanceDetailController($state, $stateParams, $log, $compile, $scope,
        spinnerService, egarBatchService, translationService,
        DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

        var vm = this;

        vm.getBatchStatus = (val)=>{ 
            if(val){
                var x = translationService.translate(val.toLowerCase());
                return x;
            }
        }

        activate();

        ////////////////

        function activate() {
          
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());
            
            vm.dtColumns = [
                DTColumnBuilder.newColumn('EgarNumber', 'Nº e-GAR')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center'),
                DTColumnBuilder
                    .newColumn('IsProcessed', 'Processado')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .renderWith((val)=> {
                        return  translationService.translateBoolean(val);
                    }),
                DTColumnBuilder.newColumn('IsSuccess', 'Sucesso')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center')
                    .renderWith((val)=> {
                        return  translationService.translateBoolean(val);
                    }),
                DTColumnBuilder.newColumn('ProcessMessage', 'Erro')
                    .notSortable()
                    .withClass('dt-center col-sm-9')
                    .withClass('dt-center')
                    .renderWith((model, a, b, element)=> {
                        if(model){
                            var obj = JSON.parse(model);
                            var array = [];
                            array = array.concat(obj.ApplicationErrors);
                            array = array.concat(obj.ExternalApplicationErrors);  
                            return  array[0] ? array[0].Value : '???';
                        }
                        return '';
                    }),

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
                                spinnerService.show('.panel');
                                egarBatchService
                                    .getEgarAcceptanceBatch($stateParams.id)
                                    .then(function (result) {
                                        if (result) {
                                            vm.batch = result.data.batch;
                                            callback(result.data.table);
                                        }
                                    }, function (error) {

                                    })
                                    .finally(function () {
                                        spinnerService.hide('.panel');
                                    });
                            })
                            .withDataProp('data')
                            ;
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }
    }
})();
