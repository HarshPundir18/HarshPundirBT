
(function () {
    'use strict';

    angular
        .module('custom')
        .controller('RcdOrServicesReceivedQuantitiesSummaryReportController', RcdOrServicesReceivedQuantitiesSummaryReportController);

    RcdOrServicesReceivedQuantitiesSummaryReportController.$inject = ['$scope', '$q', '$state',
        'spinnerService', 'translationService', 'ngDialog',
        'utilsService', 'browserService', 'dateService', 'reportService', 'fileService',
        'SMG_ESTABLISHMENT_TYPES', 'SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES', 'SMG_EGAR_TYPES'];
    function RcdOrServicesReceivedQuantitiesSummaryReportController($scope, $q, $state, 
        spinnerService, translationService, ngDialog,
        utilsService, browserService, dateService, reportService, fileService,
        SMG_ESTABLISHMENT_TYPES, SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES, SMG_EGAR_TYPES) {

        const loadingSelector = '#main';

        //VM stuff
        var vm = this;
        vm.showResults = false;
        vm.SMG_ESTABLISHMENT_TYPES = SMG_ESTABLISHMENT_TYPES;
        vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES = SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES;
        vm.SMG_EGAR_TYPES = SMG_EGAR_TYPES;
        
        // console.log('current state name: ' + $state.current.name);

        vm.mode = null;
        if($state.current.name == 'app.rcdReceivedQuantitiesSummaryReport'){
            vm.mode = SMG_EGAR_TYPES.OBRAS_RCD;
        }
        else if($state.current.name == 'app.servicesReceivedQuantitiesSummaryReport'){
            vm.mode = SMG_EGAR_TYPES.PRESTADOR_SERVICOS;
        }else{
            $state.go('app.reportsHub');
        }

        activate();


        vm.translate = (str)=>{
            return translationService.translate(str)
        }

        vm.selectedClientEstablishmentOnChange = (obj)=>{
            
        }

        //duplicated from generic.reports.controller
        vm.onSearchClick = ()=>{
            initializeResultArrays();

            vm.serverValidationErrors = [];
            vm.serverApplicationsErrors = [];
            vm.formSubmited = true;
            
            if (isValidForm()) {
                spinnerService.show(loadingSelector);

                var request = buildRequest();

                reportService
                    .createReceivedQuantitiesSummaryReport(request, vm.mode)
                    .then(onGetReportSuccess)
                    .catch(onGetReportError)
                    .finally(function() {
                        vm.formSubmited = false;
                        spinnerService.hide(loadingSelector)
                    }); 
            }
        }

        //duplicated from generic.reports.controller
        vm.onExportReportClick = function(format){
            
            if(browserService.ie()){
                alert('O Internet Explorer não suporta esta operação! \n Por favor tente com Chrome, Firefox, Edge ou Brave.');
                return;
            }

            //initializeResultArrays();

            vm.serverValidationErrors = [];
            vm.serverApplicationsErrors = [];
            vm.formSubmited = true;

            if (isValidForm()) {
                spinnerService.show(loadingSelector);
            
                var deferred = $q.defer();

                var request = buildRequest(format);

                reportService
                    .exportReceivedQuantitiesSummaryReport(request, vm.mode)
                    .then(function (result) {
    
                        fileService.downloadFile(result.data,  result.headers('Content-Type'), result.headers('x-smg-filename'));
                       
                        deferred.resolve();
                    })
                    .catch(function (error) {
                        var jsonResult = JSON.parse(new TextDecoder().decode(error.data));
                        utilsService.parseAndNotifyApplicationErrors(jsonResult._applicationErrors)
                        deferred.reject(error);
                    })
                    .finally(function() {
                        vm.formSubmited = false;
                        spinnerService.hide(loadingSelector)
                    }); 
            }
            
            return deferred.promise;
        }

        vm.onClearClick = () => {
            vm.selectedClientEstablishment = null;
            vm.startDate = null;
            vm.endDate = null;
            
            vm.totalCount = 0;
            vm.showResults = false;
            vm.reportResults = [];
        }

        vm.concatenateTransporters = (array)=>{
            if(array && array.length > 0){
                return array.join(', ');
            }

            return array;
        }

        vm.toTons = (value)=>{
            return value / 1000;
        }
        

        function buildRequest(format){
            return {
                Format: format,
                StartDate: vm.startDate,
                EndDate: vm.endDate,
                SelectedEstablishmnetId: vm.selectedClientEstablishment.id
            };
        }

        function activate(){
            initializeResultArrays();
            spinnerService.show(loadingSelector);
        }

        var isValidForm = () => {
            var isEstablishmentSelectedFlag = isEstablishmentSelected()
            var isValidDateFlag = isValidDate();

            return vm.reportForm.$valid && isEstablishmentSelectedFlag && isValidDateFlag;
        }
       
        
        var isValidDate = () => {
            vm.invalidDateErrorMessage = null;
            
            if(vm.formSubmited && !datesAreDefined()){
                vm.invalidDateErrorMessage = translationService.translate('ui_val_must_select_date_interval');
                return false;
            }

            if(datesAreDefined() && !isBetweenPeriodLimit()){
                vm.invalidDateErrorMessage = translationService.translate('ui_val_must_be_between_one_year_limit');
                return false;
            }

            if(datesAreDefined() && !isSameCivilYear()){
                vm.invalidDateErrorMessage = translationService.translate('ui_val_must_be_same_civil_year');
                return false;
            }

            if(datesAreDefined() && !isValidPeriod()){
                vm.invalidDateErrorMessage = translationService.translate('ui_val_must_be_valid_period');
                return false;
            }

            return true;
        }

        var isBetweenPeriodLimit = function(){
            if(vm.startDate && vm.endDate){
                var nDays = dateService.getNumberOfDaysInYear(vm.startDate.getFullYear());

                var daysDiff = dateService.getDaysDiff(vm.startDate, vm.endDate);

                return daysDiff <= nDays;
            }
            return false;
        }

        var isSameCivilYear = function(){
            if(vm.startDate && vm.endDate){
                return vm.endDate.getFullYear() - vm.startDate.getFullYear() == 0;
            }

            return false;
        }

        var isValidPeriod = function(){
            if(vm.startDate && vm.endDate){
                return vm.startDate <= vm.endDate;
            }

            return false;
        }

        var isEstablishmentSelected = () => {
            var establishmentIsSelected = vm.formSubmited && vm.selectedClientEstablishment != null && vm.selectedClientEstablishment != undefined;
            
            vm.invalidSelectedClientErrorMessage = establishmentIsSelected 
                ? null
                : translationService.translate('ui_val_must_select_client');

            return establishmentIsSelected;
        }

        var datesAreDefined = () => { 
            return vm.startDate != undefined && vm.endDate != undefined 
        }    


        function onGetReportSuccess(result){

            vm.reportResults = result.data.Items;

            //kind of a group by
            var aggregateByEgarType = utilsService.reduceArrayBy(result.data.Items, "EgarCreationType");

            var producerAggregate = aggregateByEgarType[vm.mode];

            if(producerAggregate){
                vm.residuesAggregate = handleProducerAggregate(producerAggregate, result.data.EstablishmentsInfo);
            }

            vm.showResults = true;
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

        function handleProducerAggregate(aggregate, establishmentsInfo){
            var result = [];

            var aggregateByOriginVat= utilsService.reduceArrayBy(aggregate, 'OriginVat');

            //iterates for each 
            for(var originVat in aggregateByOriginVat){

                var establishmentInfo = establishmentsInfo.find(function(establishment){
                    return establishment.Vat === originVat;
                });

                var apaCodeItem = aggregateByOriginVat[originVat];

                var originApaCodeAgg = {
                    originVat: originVat,
                    establishmentInfo: establishmentInfo,
                    lers: []
                };

                var aggregateByLer = utilsService.reduceArrayBy(apaCodeItem, 'FinalLer');
                for(var lerCode in aggregateByLer){

                    var lerCodeItem = aggregateByLer[lerCode];

                    var lerAgg ={
                        code: lerCode,
                        operations: []
                    };

                    var aggregateByOperation = utilsService.reduceArrayBy(lerCodeItem, 'FinalOperation');
                    for(var operationCode in aggregateByOperation){

                        var operationCodeItem = aggregateByOperation[operationCode];
                        
                        var operationAgg ={
                            code: operationCode,
                            destinApaCodes: []
                        };

                        var aggregateByDestinApaCode = utilsService.reduceArrayBy(operationCodeItem, 'DestinApaCode');
                        for(var destinApaCode in aggregateByDestinApaCode){

                            var destinItem = aggregateByDestinApaCode[destinApaCode];

                            var destinAgg = {
                                apaCode: destinApaCode,
                                transporters: [],
                                total: 0
                            };

                            for(var j=0; j < destinItem.length; j++){
                                
                                var line = destinItem[j];

                                destinAgg.total += line.SumTotal;

                                if(line.Transporter1Vat){
                                    addValueToArrayIfDoesNotExist(destinAgg.transporters, line.Transporter1Vat);
                                }
                                if(line.Transporter2Vat){
                                    addValueToArrayIfDoesNotExist(destinAgg.transporters, line.Transporter2Vat);
                                }
                                if(line.Transporter3Vat){
                                    addValueToArrayIfDoesNotExist(destinAgg.transporters, line.Transporter3Vat);
                                }
                                if(line.Transporter4Vat){
                                    addValueToArrayIfDoesNotExist(destinAgg.transporters, line.Transporter4Vat);
                                }
                                if(line.Transporter5Vat){
                                    addValueToArrayIfDoesNotExist(destinAgg.transporters, line.Transporter5Vat);
                                }
                            }

                            operationAgg.destinApaCodes.push(destinAgg); 
                        } //destin iteration

                        lerAgg.operations.push(operationAgg);
                    } //operation iteration

                    originApaCodeAgg.lers.push(lerAgg);
                } //ler iteration
                
                result.push(originApaCodeAgg);
            }

            console.log(originApaCodeAgg)

            return result;
        }

        function addValueToArrayIfDoesNotExist(array, value){
            if (!array.includes(value)) {
                array.push(value);
            }
        }

        function initializeResultArrays(){
            vm.showResults = false;
            vm.reportResults = [];
            vm.rcdResiduesAggregate = [];
            vm.ouaResiduesAggregate = [];
            vm.exSituResiduesAggregate = [];
            vm.residuesAggregate = [];
        }

        $scope.$on('fetchEstablishmentFinished_selectedClientEstablishment', function(event, item){
            spinnerService.hide(loadingSelector);
        });

    }
})();

