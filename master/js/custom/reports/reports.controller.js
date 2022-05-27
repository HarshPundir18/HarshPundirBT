
(function () {
    'use strict';

    angular
        .module('custom')
        .controller('reportsController', reportsController);

    reportsController.$inject = ['$q', '$http', 'spinnerService', 'pickupPointsService',
        'garsService', 'utilsService', 'browserService', 'dateService', 
        'SMG_ESTABLISHMENT_TYPES', 'SMG_CONST_PICKUP_POINTS'];
    function reportsController($q, $http, spinnerService, pickupPointsService,
        garsService, utilsService, browserService, dateService, 
        SMG_ESTABLISHMENT_TYPES, SMG_CONST_PICKUP_POINTS) {

        //VM stuff
        var vm = this;
        vm.SMG_ESTABLISHMENT_TYPES = SMG_ESTABLISHMENT_TYPES;
        vm.pickupPointTypeAll = SMG_CONST_PICKUP_POINTS.ALL;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        vm.submitted = false;
        vm.lerCodes = garsService.lerCodes();
        vm.selectedLerCode = null;
        vm.operationCodes = garsService.operationCodes();
        vm.selectedOperationCode = null;
        vm.allowedAccountEstablishments = [];
        vm.selectedAccountEstablishments = null;
        vm.clients = [{ "UniqueId": null, "DiplayName": "-- Selecione um APA cliente --" }];
        vm.selectedClient = vm.clients[0];
        vm.users = [{ "UniqueId": null, "Name": "-- Selecione um utilizador --" }];
        vm.periods = [];
        vm.selectedPeriod = null;
        vm.showResults = false;
        vm.egarTypes = [
            {"key": null, "value": "-- Selecione um tipo de e-Gar --" },
            {"key": "PRODUTOR_ESTABELECIMENTO", "value": "Produtor"},
            {"key": "OBRAS_RCD", "value": "Obras RCD" },
            {"key": "OLEOS_ALIMENTARES", "value": "Óleos Alimentares Usados" },
            {"key": "VEICULOS_FIM_VIDA", "value": "Veículos em fim de vida"},
            {"key": "PRESTADOR_SERVICOS", "value": "Prestador de Serviços"}
        ];
        vm.selectedEgarType = vm.egarTypes[0];

        //
        activate();

        vm.selectedPickupPointKeyUp = function(val){
            if((val && val.length > 2) || val == ''){
                getPickupPoints(val);
            }
        }

        vm.selectedAccountEstablishmentOnChange = function(obj){ }

        function getPickupPoints(val){
            pickupPointsService
                .getPickupPoints(val)
                .then(getPickupPointsOnSuccess)
                .catch(getPickupPointsOnError);
        }

        vm.lerCodeChange = function() { console.log(vm.selectedLerCode) };

        vm.operationCodeChange = function() { console.log(vm.selectedOperationCode); }

        //CALLBACKS
        function getAllowedClientEstablishmentsOnSuccess(result) {
            angular.forEach(result.data, function (value, key) {
                vm.allowedAccountEstablishments.push(value);
            });
            vm.selectedAccountEstablishments = vm.allowedAccountEstablishments[0];
        }

        function getAllowedClientEstablishmentsOnError(error) { }

        function getAllClientUsersOnSuccess(result) {
            angular.forEach(result.data, function (value, key) {
                var user = {
                    Name: value.UserName + '('+ value.Email +')',
                    UniqueId: value.UniqueId
                }
                vm.users.push(user);
            });
        }

        function getAllClientUsersOnError(error) { }

        function createReportOnSuccess(result){
            result.data.EGars.map(function(item) {
                item.HasRectifiedQuantity = item.FinalQuantity && item.ResiduoTransportado.Quantidade != item.FinalQuantity;
                item.HasRectifiedLerCode = item.FinalLerCode && item.ResiduoTransportado.CodigoResiduoLer != item.FinalLerCode;
                item.HasRectifiedOperationCode = item.FinalOperationCode && item.ResiduoTransportado.CodigoOperacao != item.FinalOperationCode;
            });
            vm.reportResults = result.data.EGars;
            vm.showResults = true;
        }

        function createReportOnError(error){
            if(error.data._validationErrors){
                vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            }else if(error.data._applicationErrors){
                utilsService.parseAndNotifyApplicationErrors(error.data._applicationErrors);
            }
            else{
                utilsService.notifyError('Não foi possível gerar o relatório. <br> Se esta situação persistir por favor contacte o suporte.'); 
            }          
        }

        function getPickupPointsOnSuccess(result){       
            vm.pickupPoints = result.data;
        }

        function getPickupPointsOnError(error){
            vm.pickupPoints = [];
        }

        //PRIVATES
        function activate() {

        }

        function createRequestObject(format){
            var transportStartDate = utilsService.formatDateServerParameter(vm.transportStartDate);
            var transportEndDate = utilsService.formatDateServerParameter(vm.transportEndDate);
            var closedStartDate = utilsService.formatDateServerParameter(vm.closedStartDate);
            var closedEndDate = utilsService.formatDateServerParameter(vm.closedEndDate);
            
            if(!vm.selectedAccountEstablishment){
                vm.accountEstablishmentsNotSelectedError = true;
                return null;
            }

            var requestObj = {
                AccountEstablishment: vm.selectedAccountEstablishment.uniqueId,
                UserId: vm.selectedUser ? vm.selectedUser.key : null,
                ClientEstablishment: vm.selectedClientEstablishment ? vm.selectedClientEstablishment.uniqueId : null,
                LerCode: vm.selectedLerCode ? vm.selectedLerCode.key : null,
                OperationCode: vm.selectedOperationCode ? vm.selectedOperationCode.key : null,
                ClientVat: vm.vat,
                GarType: vm.selectedEgarType ? vm.selectedEgarType.key : null,
                PickupPointCode: vm.selectedPickupPoint ? vm.selectedPickupPoint.internalCode : null,
                SelectedProductCodeId: vm.selectedProductCode ? vm.selectedProductCode.uniqueId : null,
                TransportStartDate: transportStartDate == null ? '' : transportStartDate,
                TransportEndDate: transportEndDate == null ? '' : transportEndDate,
                ClosedStartDate: closedStartDate == null ? '' : closedStartDate,
                ClosedEndDate: closedEndDate == null ? '' : closedEndDate,
                Format: format,
            };

            clearErrors();

            var result = validateDatePeriods(requestObj);
            if(result){
                return requestObj;
            }
            
            return null;
        }

        function clearErrors(){
            //clear errors
            vm.accountEstablishmentsNotSelectedError = false;
            vm.transportStartDateMustBeSelectedError = false;
            vm.transportEndDateMustBeSelectedError = false;
            vm.closedStartDateMustBeSelectedError = false;
            vm.closedEndDateMustBeSelectedError = false;
            vm.chooseDatePeriodError = false;
            vm.transportDateMoreThan90Error = false;
            vm.closedDateMoreThan90Error = false;
            vm.serverApplicationErrors = [];
            vm.serverValidationErrors = [];
        }

        function validateDatePeriods(requestObj){   

            //check if selected dates are valid dates
            var transportStartDateIsValid = dateService.isValidDate(vm.transportStartDate)
            var transportEndDateIsValid = dateService.isValidDate(vm.transportEndDate);
            var closedStartDateIsValid = dateService.isValidDate(vm.closedStartDate);
            var closedEndDateIsValid = dateService.isValidDate(vm.closedEndDate);

            //check if at least one date pair is selected
            if(!transportStartDateIsValid && !transportEndDateIsValid && !closedStartDateIsValid && !closedEndDateIsValid){
                vm.chooseDatePeriodError = true;
                return false;
            }

            //check if date pairs are selected
            vm.transportStartDateMustBeSelectedError = !vm.transportStartDate && transportEndDateIsValid;
            vm.transportEndDateMustBeSelectedError = !vm.transportEndDate && transportStartDateIsValid;
            vm.closedStartDateMustBeSelectedError = !vm.closedStartDate && closedEndDateIsValid;
            vm.closedEndDateMustBeSelectedError = !vm.closedEndDate && closedStartDateIsValid;

            if(vm.transportStartDateMustBeSelectedError || vm.transportEndDateMustBeSelectedError ||
                vm.closedStartDateMustBeSelectedError || vm.closedEndDateMustBeSelectedError) {
                return false;
            }

            //check if date intervals are <= 90
            var transporteDaysDiff = dateService.getDaysDiff(vm.transportStartDate, vm.transportEndDate);
            if(transporteDaysDiff < 0 || transporteDaysDiff > 90){
                 vm.transportDateMoreThan90Error = true;
            }

            var closeDaysDiff = dateService.getDaysDiff(vm.closedStartDate, vm.closedEndDate);
            if(closeDaysDiff < 0 || closeDaysDiff > 90){
                 vm.closedDateMoreThan90Error = true;
            }

            //if no errors
            if(!vm.transportStartDateMustBeSelectedError && !vm.transportEndDateMustBeSelectedError &&
                !vm.closedStartDateMustBeSelectedError && !vm.closedEndDateMustBeSelectedError &&
                !vm.transportDateMoreThan90Error && !vm.closedDateMoreThan90Error){

                return true;
            }

            return false;
        }

        // vm.openFile = function (name) {		
        // 	$window.open('http://localhost:38682/api/export/xlsx');					//OK
        // 	$window.open('http://localhost:38682/api/reports/exportIE', '_blank'); 		//OK
        // }

        vm.createReport = function () {
            vm.showResults = false;

            //validate Vat input
            var input =  vm.dummyForm['vat'];
            var errorType = input.$error['pattern'];
            vm.invalidVat = (input.$dirty || vm.submitted) && errorType;
            
            if(vm.invalidVat){
                return
            }

            spinnerService.show("#panelGeneralData");
            var request =  createRequestObject();
            if(request == null){
                spinnerService.hide("#panelGeneralData");
                return;
            }

            $http
                .post('/api/reports', request)
                .then(createReportOnSuccess)
                .catch(createReportOnError)
                .finally(function() { spinnerService.hide("#panelGeneralData")});
        }

        vm.downloadFile = function (format) {

            if(browserService.ie()){
                alert('O Internet Explorer não suporta esta operação! \n Por favor tente com Chrome, Firefox ou Edge.');
                return;
            }

            spinnerService.show('#reports');

            var deferred = $q.defer();
            var request =  createRequestObject(format);
            if(request == null){
                spinnerService.hide('#reports');
                return;
            }

            $http
                .post('/api/reports/export', request, {
                    responseType: "arraybuffer",
                })
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
                        console.log(ex);
                    }

                    deferred.resolve(filename);
                    spinnerService.hide('#reports');
                }, function (error) {
                    deferred.reject(error);
                })
            return deferred.promise;
        }

        vm.clearFilters = function() {
            vm.selectedLerCode = null;
            vm.selectedOperationCode = null;
            vm.selectedClient = vm.clients[0];
            vm.selectedUser = vm.users[0];
            vm.selectedPeriod =  vm.periods[0];
            vm.selectedClosePeriod = vm.periods[0];
            vm.showResults = false;
            vm.reportResults = [];
        }

        vm.onSelectedProductCodeChange = function(obj){
            console.log(obj);
        }

        //SCOPE stuff
    }
})();