
(function () {
    'use strict';

    angular
        .module('custom')
        .controller('GenericReportsController', GenericReportsController);

    GenericReportsController.$inject = ['$rootScope', '$scope', '$q', '$filter', '$state', '$stateParams', 'spinnerService', 'ngDialog',
        'garsService', 'utilsService', 'browserService', 'dateService', 'reportService',
        'SMG_ESTABLISHMENT_TYPES', 'SMG_CONST_PICKUP_POINTS', 'SMG_ALERT_TYPE', 'SMG_EGAR_TYPES'];
    function GenericReportsController($rootScope, $scope, $q, $filter, $state, $stateParams, spinnerService, ngDialog,
        garsService, utilsService, browserService, dateService, reportService,
        SMG_ESTABLISHMENT_TYPES, SMG_CONST_PICKUP_POINTS, SMG_ALERT_TYPE, SMG_EGAR_TYPES) {

        const loadingSelector = '#reports';

        //VM stuff
        var vm = this;
        vm.message = 'Greeting from GenericReportsController';
        vm.SMG_CONST_PICKUP_POINTS = SMG_CONST_PICKUP_POINTS;
        vm.SMG_ESTABLISHMENT_TYPES = SMG_ESTABLISHMENT_TYPES;
        vm.SMG_ALERT_TYPE = SMG_ALERT_TYPE;
        
        vm.egarTypes = garsService.egarTypesV2();
        vm.reportResults = [];
        vm.asOrigin = true;
        vm.asDestin = true;
        vm.asTransporter=false;
        vm.formSubmited = false;
        vm.startDate = null;
        vm.endDate = null;

        // vm.note = `
        // <p>
        //     O período máximo de pesquisa para gerar o relatório é de 1 ano (i). O número máximo de pedidos de geração de relatórios é de 10 por dia.
        // </p>
        // <p>
        //     A exportação de relatórios com mais de 1000 linhas serão gerados de forma assíncrona e ficarão disponíveis para download na área 
        //     <strong><em class="fa fa-folder-open fa-1point5"></em> Geração de Documentos </strong>
        // </p>
        // <p>
        //     (i) A data de pesquisa refere-se à data do primeiro transporte.
        // </p>
        // `

        vm.note = `
        <p>
            O período máximo de pesquisa para gerar o relatório é de 1 ano. A data de pesquisa refere-se à data do primeiro transporte.
        </p>
        <p>
            A exportação de relatórios com mais de 1000 linhas serão gerados de forma assíncrona e ficarão disponíveis para download na área 
            <strong><em class="fa fa-folder-open fa-1point5"></em> Geração de Documentos </strong>
        </p>
        `;

        vm.note2 = `
        <p>
            Para efeitos de preenchimento do MIRR, até 31 de Março, o SMARTGAR não terá limite de geração de relatórios.
        </p>
        `;

        


        vm.onBackClick = ()=>{
            if($stateParams.previousState == 'app.reportsHub'){
                $state.go($stateParams.previousState)
            }else{
                $state.go('app.dashboard')
            }
            
        }

        vm.checkMustSelectStartDate = ()=>{
            return !vm.startDate && vm.endDate;
        }

        vm.checkMustSelectEndDate = () =>{
            return vm.startDate && !vm.endDate;
        }

        vm.onSearchClick = ()=>{
            if(!validateForm()){
                return;
            }

            vm.totalCount = 0;
            vm.showResults = false;
            vm.reportResults = [];

            getReport();
        }

        vm.onClearClick = () => {
            vm.selectedAccountEstablishment = null;
            vm.selectedUser = null;
            vm.selectedClientEstablishment = null;
            vm.selectedLer = null;
            vm.selectedOperation = null;
            vm.vat = null;
            vm.selectedEgarType = null;
            vm.selectedPickupPoint = null;
            vm.selectedProductCode = null;
            vm.startDate = null;
            vm.endDate = null;
            
            vm.totalCount = 0;
            vm.showResults = false;
            vm.reportResults = [];
        }


        vm.onExportReportClick = function(format){
            if(!validateForm()){
                return;
            }
            
            if(browserService.ie()){
                alert('O Internet Explorer não suporta esta operação! \n Por favor tente com Chrome, Firefox, Edge ou Brave.');
                return;
            }

            vm.formSubmited = true;
            spinnerService.show(loadingSelector);
            
            var deferred = $q.defer();
            
            var request =  createRequestObject(format);

            reportService
                .exportReportV2(request)
                .then(function (data, status, headers) {

                    var contentType = data.headers('Content-Type');
                    var isSyncReport = data.headers('x-smg-async-report');
                    var filename = data.headers('x-smg-filename');

                    //accepted
                    if(data.status == 202 && isSyncReport == 'true'){
                        vm.dialog = ngDialog.open({
                            template: '/app/custom/reports/async.report.info.dialog.html',
                            className: 'ngdialog-theme-default',
                            width: 400,
                            showClose: true,
                            controller: 'GenericReportsController as vm',
                            scope: $scope,
                            closeByNavigation: true,
                        });
                    }else if(data.status === 200){
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
                })
                
            return deferred.promise;
        }


        vm.openDocuments = () => {
            ngDialog.close();
            $rootScope.$broadcast('toggleGeneratedDocuments', { a: 1, b:2 });
        }


        var validateForm = () => {
            //clear all errors
            vm.mustSelectAccountEstablishmentError = false;
            vm.mustSelectDate=false;
            vm.mustSelectDateIntervalError=false;
            vm.mustSelectHigherEndDateError = false;
            vm.maxDateIntervalError=false;

            
            vm.mustSelectAccountEstablishmentError = vm.selectedAccountEstablishment == null || vm.selectedAccountEstablishment == undefined;
      
            //check if a date is defined
            if(vm.startDate == null && vm.endDate == null && vm.closeDate == null){
                vm.mustSelectDate = true;
                return;
            }
      
            if(vm.closeDate == null){
                //check if date interval is defined
                vm.mustSelectDateIntervalError = !(dateService.isValidDate(vm.startDate) && dateService.isValidDate(vm.endDate));
                
                if(!vm.mustSelectEndDateError && !vm.mustSelectStartDateError){
                    var diff = dateService.getDaysDiff(vm.startDate, vm.endDate);
                    vm.mustSelectHigherEndDateError = diff < 0;
                    vm.maxDateIntervalError = diff > 365;
                }
                else{
                    vm.mustSelectHigherEndDateError = false;    
                    vm.maxDateIntervalError = false;
                }
            }

            return !vm.mustSelectAccountEstablishmentError &&
                    !vm.mustSelectDateIntervalError &&
                    !vm.mustSelectHigherEndDateError &&
                    !vm.maxDateIntervalError;
        }

        vm.onLoadMoreClick = () => {
            getReport();
        }

        vm.onCloseDateChange = (obj)=>{
            console.log(obj);
        }

        function getReport(){
            vm.formSubmited = true;

            spinnerService.show(loadingSelector);
            
            var request = createRequestObject();

            reportService
                .createReportV2(request)
                .then(onGetReportSuccess)
                .catch(onGetReportError)
                .finally(function() {
                    vm.formSubmited = false;
                    spinnerService.hide(loadingSelector)
                });  
        }

        function onGetReportSuccess(result){
            result.data.EGars.map(function(item) {
                //if item.ResiduoTransportadoCorrigido.Quantidade is defined and it is different from the original quantity
                item.HasRectifiedQuantity =  item.ResiduoTransportadoCorrigido 
                                            && item.ResiduoTransportadoCorrigido.QuantidadeCorrigido
                                            && item.ResiduoTransportado.Quantidade != item.ResiduoTransportadoCorrigido.QuantidadeCorrigido;

                item.HasRectifiedLerCode =  item.ResiduoTransportadoCorrigido
                                            && item.ResiduoTransportadoCorrigido.CodigoResiduoLerCorrigido
                                            && item.ResiduoTransportado.CodigoResiduoLer != item.ResiduoTransportadoCorrigido.CodigoResiduoLerCorrigido;

                item.HasRectifiedOperationCode = item.ResiduoTransportadoCorrigido
                                            && item.ResiduoTransportadoCorrigido.CodigoOperacaoCorrigido
                                            && item.FinalOperationCode && item.ResiduoTransportado.CodigoOperacao != item.ResiduoTransportadoCorrigido.CodigoOperacaoCorrigido;

                vm.reportResults.push(item);
            });
            
            vm.showResults = true;
            vm.totalCount = result.data.TotalCount;
            
        }

        function onGetReportError(error){
            if(error.data._validationErrors){
                vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            }else if(error.data._applicationErrors){
                utilsService.parseAndNotifyApplicationErrors(error.data._applicationErrors);
            }
            else{
                utilsService.notifyError('Não foi possível gerar o relatório. <br> Se esta situação persistir por favor contacte o suporte.'); 
            }          
        }

        function createRequestObject(format){
            var requestObj = {
                EstablishmentId: vm.selectedAccountEstablishment.id,
                UserId: vm.selectedUser ? vm.selectedUser.id : null,
                ClientEstablishment: vm.selectedClientEstablishment ? vm.selectedClientEstablishment.id : null,
                LerCode: vm.selectedLer ? vm.selectedLer.key : null,
                OperationCode: vm.selectedOperation ? vm.selectedOperation.key : null,
                ClientVat: vm.vat,
                GarType: vm.selectedEgarType ? vm.selectedEgarType.key : null,
                PickupPointCode: vm.selectedPickupPoint ? vm.selectedPickupPoint.internalCode : null,
                ProductCodeId: vm.selectedProductCode ? vm.selectedProductCode.id : null,
                // StartDate: vm.startDate ? vm.startDate : null,
                // EndDate: vm.endDate ? vm.endDate : null,
                StartDate: vm.startDate ?  $filter('date')(vm.startDate, 'yyyy-MM-dd') : null,
                EndDate: vm.endDate ?  $filter('date')(vm.endDate, 'yyyy-MM-dd') : null,
                StartDateOffset: vm.startDate ? vm.startDate : null,
                EndDateOffset: vm.endDate ? vm.endDate : null,
                CloseDate: vm.closeDate ? vm.closeDate.key : null,
                Format: format,
                Offset: vm.reportResults.length,
                AsOrigin: vm.asOrigin,
                AsDestin: vm.asDestin,
                AsTransporter: vm.asTransporter,
                EgarTypes: [
                    SMG_EGAR_TYPES.PRODUTOR_ESTABELECIMENTO, 
                    SMG_EGAR_TYPES.OLEOS_ALIMENTARES,
                    SMG_EGAR_TYPES.OBRAS_RCD,
                    SMG_EGAR_TYPES.VEICULOS_FIM_VIDA,
                    SMG_EGAR_TYPES.EX_SITU,
                    SMG_EGAR_TYPES.PRESTADOR_SERVICOS
                ]
            };

            return requestObj;
        }

    }
})();

