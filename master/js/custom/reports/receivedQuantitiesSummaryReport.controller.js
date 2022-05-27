
(function () {
    'use strict';

    angular
        .module('custom')
        .controller('ReceivedQuantitiesSummaryReportController', ReceivedQuantitiesSummaryReportController);

        ReceivedQuantitiesSummaryReportController.$inject = ['$scope', '$q',
        'spinnerService', 'translationService', 
        'utilsService', 'browserService', 'dateService', 'reportService', 'fileService',
        'SMG_ESTABLISHMENT_TYPES', 'SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES', 'SMG_EGAR_TYPES', 'SMG_EGAR_TYPES_ENUM'];
    function ReceivedQuantitiesSummaryReportController($scope, $q,
        spinnerService, translationService,
        utilsService, browserService, dateService, reportService, fileService,
        SMG_ESTABLISHMENT_TYPES, SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES, SMG_EGAR_TYPES, SMG_EGAR_TYPES_ENUM) {

        const loadingSelector = '#main';

        //VM stuff
        var vm = this;
        vm.reportResults = [];
        vm.showResults = false;
        vm.message = 'Greeting from ReceivedQuantitiesSummaryReportController';
        vm.SMG_ESTABLISHMENT_TYPES = SMG_ESTABLISHMENT_TYPES;
        vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES = SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES;
   
        vm.selectedType = vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.AllEstablishmentsWithVat;


        activate();

        //testProdutorEstabelecimento();

        vm.translate = (str)=>{
            return translationService.translate(str)
        }

        vm.selectedClientEstablishmentOnChange = (obj)=>{
            if(obj){
                vm.invalidSelectedClientErrorMessage = null;

                vm.singleEstablishmentMessage = 'Apenas para o estabelecimento';
                if(obj.vat){
                    vm.allEstablishmentsOfVatMessage = `Todos estabelecimentos do NIF ${obj.vat}`;
                }else{
                    vm.allEstablishmentsOfVatMessage = `Todos estabelecimentos do NIF (sem NIF definido!)`;
                }
            }
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
                    .createReceivedQuantitiesSummaryReport(request, SMG_EGAR_TYPES.PRODUTOR_ESTABELECIMENTO)
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
                    .exportReceivedQuantitiesSummaryReport(request, SMG_EGAR_TYPES.PRODUTOR_ESTABELECIMENTO)
                    .then(function (result) {
    
                        fileService.downloadFile(result.data,  result.headers('Content-Type'), result.headers('x-smg-filename'));
                       
                        deferred.resolve();

                        //spinnerService.hide(loadingSelector);
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
        

        function activate(){
            initializeResultArrays();
            spinnerService.show(loadingSelector);
        }

        var isValidForm = () => {
            var isEstablishmentSelectedFlag = isEstablishmentSelected()
            var isValidDateFlag = isValidDate();

            return vm.reportForm.$valid && vm.selectedType != undefined &&  isEstablishmentSelectedFlag && isValidDateFlag;
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


        function testProdutorEstabelecimento(){
            var items = {
                "Items": [
                    {
                        "OriginApaCode": "APA00040852",
                        "OriginPickUpPointCode": null,
                        "FinalLer": "150101",
                        "FinalOperation": "R13",
                        "DestinApaCode": "APA00678463",
                        "SumTotal": 38510.0,
                        "Transporter1Vat": "210786248",
                        "Transporter2Vat": null,
                        "Transporter3Vat": null,
                        "Transporter4Vat": null,
                        "Transporter5Vat": null,
                        "EgarCreationType": "PRODUTOR_ESTABELECIMENTO"
                    },
                    {
                        "OriginApaCode": "APA00041153",
                        "OriginPickUpPointCode": null,
                        "FinalLer": "010102",
                        "FinalOperation": "D1",
                        "DestinApaCode": "APA00678463",
                        "SumTotal": 29932.0,
                        "Transporter1Vat": "501943625",
                        "Transporter2Vat": null,
                        "Transporter3Vat": null,
                        "Transporter4Vat": null,
                        "Transporter5Vat": null,
                        "EgarCreationType": "PRODUTOR_ESTABELECIMENTO"
                    },
                    {
                        "OriginApaCode": "APA00041153",
                        "OriginPickUpPointCode": null,
                        "FinalLer": "150101",
                        "FinalOperation": "R13",
                        "DestinApaCode": "APA00678463",
                        "SumTotal": 58.0,
                        "Transporter1Vat": "157394689",
                        "Transporter2Vat": null,
                        "Transporter3Vat": null,
                        "Transporter4Vat": null,
                        "Transporter5Vat": null,
                        "EgarCreationType": "PRODUTOR_ESTABELECIMENTO"
                    },
                    {
                        "OriginApaCode": "APA00041153",
                        "OriginPickUpPointCode": null,
                        "FinalLer": "150102",
                        "FinalOperation": "R13",
                        "DestinApaCode": "APA00678463",
                        "SumTotal": 35.0,
                        "Transporter1Vat": "210786248",
                        "Transporter2Vat": null,
                        "Transporter3Vat": null,
                        "Transporter4Vat": null,
                        "Transporter5Vat": null,
                        "EgarCreationType": "PRODUTOR_ESTABELECIMENTO"
                    },
                    {
                        "OriginApaCode": "APA00041153",
                        "OriginPickUpPointCode": null,
                        "FinalLer": "180103",
                        "FinalOperation": "D15",
                        "DestinApaCode": "APA00678463",
                        "SumTotal": 255.0,
                        "Transporter1Vat": "501943625",
                        "Transporter2Vat": null,
                        "Transporter3Vat": null,
                        "Transporter4Vat": null,
                        "Transporter5Vat": null,
                        "EgarCreationType": "PRODUTOR_ESTABELECIMENTO"
                    },
                    {
                        "OriginApaCode": "APA00041153",
                        "OriginPickUpPointCode": null,
                        "FinalLer": "180103",
                        "FinalOperation": "D5",
                        "DestinApaCode": "APA00678463",
                        "SumTotal": 2550.0,
                        "Transporter1Vat": "501943625",
                        "Transporter2Vat": null,
                        "Transporter3Vat": null,
                        "Transporter4Vat": null,
                        "Transporter5Vat": null,
                        "EgarCreationType": "PRODUTOR_ESTABELECIMENTO"
                    }
                ],
                "EstablishmentsInfo": [
                    {
                        "UserEstablishmentId": 2,
                        "ClientId": 1,
                        "Name": "Bz Jop 852",
                        "Vat": "501943625",
                        "ApaCode": "APA00040852",
                        "Password": null,
                        "IsDefault": false,
                        "IsAccessConfigured": false,
                        "UniqueId": "f0fea488-75cd-464f-af92-678e06b9d5c3",
                        "Street": null,
                        "PostalCode": null,
                        "Local": null,
                        "City": null,
                        "ExSituPickupPointUniqueId": null,
                        "OuaPickupPointUniqueId": null,
                        "ExternalId": null
                    },
                    {
                        "UserEstablishmentId": 3,
                        "ClientId": 1,
                        "Name": "Jop 153",
                        "Vat": "501943625",
                        "ApaCode": "APA00041153",
                        "Password": "3LgoYaR73on8WgBTqb/nyg==",
                        "IsDefault": false,
                        "IsAccessConfigured": true,
                        "UniqueId": "0032de07-90ef-4fbb-9168-c6e34e7ec771",
                        "Street": null,
                        "PostalCode": null,
                        "Local": null,
                        "City": null,
                        "ExSituPickupPointUniqueId": null,
                        "OuaPickupPointUniqueId": null,
                        "ExternalId": null
                    },
                    {
                        "UserEstablishmentId": 9,
                        "ClientId": 1,
                        "Name": "Jop 081",
                        "Vat": "501943625",
                        "ApaCode": "APA00169081",
                        "Password": null,
                        "IsDefault": false,
                        "IsAccessConfigured": false,
                        "UniqueId": "0c4f4808-9ecc-46e7-be1c-54a0912c1adf",
                        "Street": null,
                        "PostalCode": null,
                        "Local": null,
                        "City": null,
                        "ExSituPickupPointUniqueId": null,
                        "OuaPickupPointUniqueId": null,
                        "ExternalId": null
                    }
                ],
                "EgarType": "PRODUTOR_ESTABELECIMENTO",
                "IsSuccess": true,
                "IsError": false,
                "ApplicationErrors": [],
                "ExternalApplicationErrors": []
            }

            var result = {
                data: items
            }

            onGetReportSuccess(result)
        }


        function buildRequest(format){
            return {
                Format: format,
                StartDate: vm.startDate,
                EndDate: vm.endDate,
                SelectedEstablishmnetId: vm.selectedClientEstablishment.id,
                QuantitiesDeclarationRequestType: vm.selectedType
            }
        }

        function onGetReportSuccess(result){

            vm.reportResults = result.data.Items;

            //kind of a group by
            var aggregateByEgarType = utilsService.reduceArrayBy(result.data.Items, "EgarCreationType");

            //test print object properties
            // for (const a in aggregateByEgarType) {
            //     console.log(a)
            // }

            var producerAggregate = aggregateByEgarType[SMG_EGAR_TYPES.PRODUTOR_ESTABELECIMENTO];
            if(producerAggregate){
                vm.generalResiduesAggregate = handleProducerAggregate(producerAggregate, result.data.EstablishmentsInfo);
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

            //var aggregateByOriginApaCode= utilsService.groupBy(aggregate, (item)=>{return [item.OriginApaCode];});
            var aggregateByOriginApaCode= utilsService.reduceArrayBy(aggregate, 'OriginApaCode');

            //iterates for each originApaCode
            for(var originApaCode in aggregateByOriginApaCode){

                var establishmentInfo = establishmentsInfo.find(function(establishment){
                    return establishment.ApaCode === originApaCode;
                });

                var apaCodeItem = aggregateByOriginApaCode[originApaCode];

                var originApaCodeAgg = {
                    originApaCode: originApaCode,
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
            vm.generalResiduesAggregate = [];
        }

        $scope.$on('fetchEstablishmentFinished_selectedClientEstablishment', function(event, item){
            spinnerService.hide(loadingSelector);
        });

    }
})();

