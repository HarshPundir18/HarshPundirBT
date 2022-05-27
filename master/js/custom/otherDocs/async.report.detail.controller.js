
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('asyncReportDetailController', asyncReportDetailController);

        asyncReportDetailController.$inject = ['$state', '$scope', '$compile', '$timeout', '$stateParams',
        'spinnerService', 'egarBatchService', 'translationService', 'otherDocsService', 'browserService',
        'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder'];
    function asyncReportDetailController($state, $scope, $compile, $timeout, $stateParams,
        spinnerService, egarBatchService, translationService, otherDocsService, browserService,
        DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

        var vm = this;
        vm.items = [];
        vm.dtInstance = null;
        vm.progressBar = [];
        vm.number = 10;
        var loadingGifSelector = '#main';

        activate();

        vm.downloadFile = function (fileId) {
            if(browserService.ie()){
                alert('O Internet Explorer não suporta esta operação! \n Por favor tente com Chrome, Firefox ou Edge.');
                return;
            }

            spinnerService.show('#main');

            otherDocsService
                .downloadExSituDeclarationFile($stateParams.requestId, fileId)
                .then(
                    function (data, status, headers) {
                        var contentType = data.headers('Content-Type');
                        var filename = data.headers('x-smg-filename');

                        try {
                            var blob = new Blob([data.data], { type: contentType });
                            var url = window.URL.createObjectURL(blob);
                            var linkElement = document.createElement('a');
                            linkElement.setAttribute('href', url);
                            linkElement.setAttribute("download", filename);

                            var clickEvent = new MouseEvent("click", {
                                "view": window,
                                "bubbles": true,
                                "cancelable": false
                            });
                            linkElement.dispatchEvent(clickEvent);
                        } catch (ex) {
                            alert('O seu Browser nao suporta esta operação!')
                            spinnerService.hide('#main');
                        }
                        spinnerService.hide('#main');
                    }, function (error) {
                    }
                );
        }

        ////////////////

        function activate() {  
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

            vm.dtColumns = [
                DTColumnBuilder
                    .newColumn('FileName', 'Ficheiro')
                    .notSortable()
                    .withClass('dt-center col-sm-4'),
                
                DTColumnBuilder.newColumn('', '')
                    .notSortable()
                    .withClass('dt-right col-sm-1')
                    .renderWith((actions, msg, model, cell)=> {
                        //return "<button  type='submit' class='btn btn-labeled btn-success' ng-click=vm.downloadFile('" + model.RowKey + "')>ver</button>";
                        return "<span title='Download' class='btn btn-labeled btn-info' ng-click=vm.downloadFile('" + model.RowKey + "')>Download</span>";
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


        function getData(dataTable, callback, settings) {
            spinnerService.show(loadingGifSelector);
            otherDocsService
                .getGeneratedDocumentDetails( $stateParams.requestId)
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
   

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        $scope.$on('$destroy', function() {  });        
    }
})();
