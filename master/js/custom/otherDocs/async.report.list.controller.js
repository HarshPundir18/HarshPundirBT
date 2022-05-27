
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('asyncReportListController', asyncReportListController);

    asyncReportListController.$inject = ['$q', '$state', '$scope', '$compile', '$timeout',
        'spinnerService', 'translationService', 'reportService', 'dateService', 'browserService', 'otherDocsService',
        'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder', 
        'SMG_ASYNC_REPORT_STATUS', 'SMG_ALERT_TYPE'];
    function asyncReportListController($q, $state, $scope, $compile, $timeout,
        spinnerService, translationService, reportService, dateService, browserService, otherDocsService,
        DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, 
        SMG_ASYNC_REPORT_STATUS, SMG_ALERT_TYPE) {

        var vm = this;
        vm.items = [];
        vm.dtInstance = null;
        vm.progressBar = [];
        vm.number = 10;
        vm.SMG_ASYNC_REPORT_STATUS = SMG_ASYNC_REPORT_STATUS;
        vm.SMG_ALERT_TYPE = SMG_ALERT_TYPE;
        var loadingSelector = '#main';
        var firstTimeLoading = true;
        var loadTime = 5000, //Load the data every miliseconds
        errorCount = 0, //Counter for the server errors
        loadPromise; //Pointer to the promise created by the Angular $timout service

        activate();

        vm.goToDetail = function(id){
            $state.go('app.generatedDocumentsReportDetail', { requestId: id })
        }

        vm.note = 'Relatórios assíncronos estão disponiveis durante 5 dias após a criação.';

        ////////////////

        function activate() {
          
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());
            
            vm.dtColumns = [
                DTColumnBuilder.newColumn('CreatedUtc', 'Data Criação')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .renderWith((actions, msg, model, cell)=> {
                        return dateService.toFormatedString(new Date(model.CreatedUtc));
                    }),

                DTColumnBuilder.newColumn('AccountEstablishment', 'Estabelecimento')
                    .notSortable()
                    .withClass('dt-center col-sm-2')
                    .renderWith((actions, msg, model, cell)=> {
                        return `<span>${model.AccountEstablishment}</span>`
                    }),
                
                DTColumnBuilder
                    .newColumn('timestamp', 'Filtros')
                    .notSortable()
                    .withClass('dt-center col-sm-4 text-left')
                    .renderWith((actions, msg, model, cell)=> {
                        //return '<i class="fa fa-filter" aria-hidden="true"/>';
                        var result = ''
                        if(model.Filters.ClientEstablishment){
                            result += filtersTemplate('Cliente/Fornecedor', model.Filters.ClientEstablishment);
                        }
                        if(model.Filters.StartDate){
                            result += filtersTemplate('Data entre', `${dateService.toFormatedString(new Date(model.Filters.StartDate))} e ${dateService.toFormatedString(new Date(model.Filters.EndDate))}`);
                        }
                        if(model.Filters.LerCode){
                            result += filtersTemplate('LER', model.Filters.LerCode);
                        }
                        if(model.Filters.OperationCode){
                            result += filtersTemplate('Operação', model.Filters.OperationCode);
                        }
                        if(model.Filters.User){
                            result += filtersTemplate('Utilizador', model.Filters.User.Email);
                        }
                        if(model.Filters.Product){
                            result += filtersTemplate('Produto', model.Filters.Product.InternalCode);
                        }
                        if(model.Filters.PickupPoint){
                            result += filtersTemplate('Ponto de recolha', model.Filters.PickupPoint.InternalCode);
                        }


                        return result;
                    }),

                DTColumnBuilder.newColumn('Estado', 'Status')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center')
                    .renderWith((actions, msg, model, cell)=> {
                        return `<span>${translationService.translateEnum(vm.SMG_ASYNC_REPORT_STATUS, model.Status)}</span>`;
                    }),

                DTColumnBuilder.newColumn('Progress', 'Progresso')
                    .notSortable()
                    .withClass('dt-center col-sm-1')
                    .withClass('dt-center')
                    .renderWith((actions, msg, model, cell)=> {
                        setProgressBarValues(model);

                        if(model.Status == vm.SMG_ASYNC_REPORT_STATUS.FinishedSuccess){
                            return "<button  type='submit' class='btn btn-labeled btn-success' ng-click=vm.downloadAsyncReport('" + model.Id + "')><i class='fa fa-download'/></button>";
                        }
                        else{
                            var completedItems = vm.progressBar[model.Id].completedItems;
                            var totalItems = vm.progressBar[model.Id].totalItems;

                            return `<progress value="${completedItems}" max="${totalItems} title=""></progress>
                                    <br>
                                    <span>
                                        <small>${setPercentageTitle(completedItems, totalItems, model.Status)}</small>
                                    </span>
                                    ` ;
                        }
                        
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

        vm.downloadAsyncReport = (id) => {
            console.log(id);
            
            if(browserService.ie()){
                alert('O Internet Explorer não suporta esta operação! \n Por favor tente com Chrome, Firefox, Edge ou Brave.');
                return;
            }

            spinnerService.show(loadingSelector);
            
            var deferred = $q.defer();
            
            otherDocsService
                .downloadAsyncReport(id)
                .then(function (data, status, headers) {

                    var contentType = data.headers('Content-Type');
                    var isSyncReport = data.headers('x-smg-async-report');
                    var filename = data.headers('x-smg-filename');

                    if(data.status === 200){
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
                            console.log(ex);
                        }
                    }
                   
                    deferred.resolve(filename);
                    spinnerService.hide(loadingSelector);

                }, function (error) {
                    var jsonResult = JSON.parse(new TextDecoder().decode(error.data));
                    utilsService.parseAndNotifyApplicationErrors(jsonResult._applicationErrors)
                    spinnerService.hide(loadingSelector);
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function setPercentageTitle(completedItems, totalItems, status) {
            if(completedItems >= totalItems && status != vm.SMG_ASYNC_REPORT_STATUS.FinishedSuccess){
                return `...a gerar ficheiro`;
            }
            
            var value = (completedItems/totalItems) * 100;
            return `${value}%`;
        }

        function reloadDatatable(){
            vm.dtInstance.reloadData(null, true);
        }

        function getData(dataTable, callback, settings) {
            if(firstTimeLoading){
                spinnerService.show(loadingSelector);
            }
            
            reportService
                .getAsyncReportList()
                .then(function (result) {
                    if (result) {
                        callback(result.data);
                    }
                }, function (error) {
                    cancelNextLoad();
                })
                .finally(function () {
                    if(firstTimeLoading){
                        spinnerService.hide(loadingSelector);
                        firstTimeLoading = false;
                    }
                    nextLoad();
                });
        };

        var nextLoad = function(mill) {
            mill = mill || loadTime;
            //Always make sure the last timeout is cleared before starting a new one
            cancelNextLoad();

            if(atLeastOneTableRowNotFinishedState()){
                loadPromise = $timeout(getProgress, mill);            
            }
        };

        var cancelNextLoad = function() {
            $timeout.cancel(loadPromise);
        };
          
        var inFinishedState = (element, index, array) => {
            return element.Status == vm.SMG_ASYNC_REPORT_STATUS.FinishedSuccess ||
                    element.Status == vm.SMG_ASYNC_REPORT_STATUS.ExceptionFetchingRecords ||
                    element.Status == vm.SMG_ASYNC_REPORT_STATUS.ExceptionCreatingFile ||
                    element.Status == vm.SMG_ASYNC_REPORT_STATUS.ExceptionUploadingFile
                    ;
        }

        var atLeastOneTableRowNotFinishedState = ()=>{
            var dataLength = vm.dtInstance.DataTable.data().length;
            if(dataLength > 0){
                for(var i=0; i<dataLength; i++){
                    var element = vm.dtInstance.DataTable.data()[i];
                    if(!inFinishedState(element)){
                        return true
                    }
                }
                return false;
            }
            return false;
        }

        var getProgress = function() {
            reportService
                .getAsyncReportList()
                .then(function (result) {
                    if (result) {
                        reloadDatatable();
                    }
                    
                    nextLoad();
                    
                }, function (error) {
                    //TODO: maybe implemetn exponential retry 
                    cancelNextLoad();
                })
                .finally(function () {
                    spinnerService.hide(loadingGifSelector);
                });
        }

        function setProgressBarValues(obj){
            vm.progressBar[obj.Id] = {
                totalItems: obj.TotalItems,
                completedItems: obj.FetchedItems
            }
        }

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }


        var filtersTemplate = (label, value)=>{
            return `
                            <div class="row mar-0 table-colum-list">
                                <div class="col-sm-4 text-right">
                                    <span>${label}:</span>
                                </div>
                                <div class="col-sm-8 text-left">
                                    <span>${value}</span>
                                </div>
                            </div>`
                            ;
        }


        $scope.$on('$destroy', function() {
            cancelNextLoad();
            console.log('destroy');
        });
        
    }
})();
