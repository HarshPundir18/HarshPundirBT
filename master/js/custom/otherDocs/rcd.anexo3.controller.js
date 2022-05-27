(function() {
    'use strict';

    angular
        .module('custom')
        .controller('rcdAnexo3Controller', rcdAnexo3Controller);

    rcdAnexo3Controller.$inject = ['$scope', '$filter',
        'establishmentService',
        'garsAttachmentService', 'spinnerService', 'utilsService', 'SMG_ESTABLISHMENT_TYPES'];
    function rcdAnexo3Controller($scope, $filter,
        establishmentService,
        garsAttachmentService,
        spinnerService, 
        utilsService,
        SMG_ESTABLISHMENT_TYPES) {
        
        //VM stuff
        var vm = this;
        vm.SMG_ESTABLISHMENT_TYPES = SMG_ESTABLISHMENT_TYPES;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];

        vm.eGars = [];
        vm.labelText = "Selecione o estabelecimento emissor";
        vm.msg = "rcdAnexo3Controller here";
        vm.msg1 = "oneWayMessage here";
        vm.msg2 = "twoWayMessage here";
        vm.submitted = false;
        vm.accountEstablishments = [];
        vm.selectedAccountEstablishment = null;
        vm.clientEstablishments = [];
        vm.selectedEstablishments = null;
        vm.periodKey = 0;

        vm.selectedAccountEstablishment = null;
        vm.selectedAccountEstablishmentKey = null;
        vm.onAccountEstablishmentChange = function(obj){ console.log(obj) }

        vm.validateInput = function(name, type) {
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            var result = (input.$dirty || vm.submitted) && errorType;
            return result;
        };

        vm.submitForm = function() {
            vm.serverValidationErrors = [];
            vm.serverApplicationsErrors = [];
            vm.submitted = true;

            if (vm.formValidate.$valid) {
                var data = createRequestObject();

                spinnerService.show('#cenas');
                garsAttachmentService
                    .getEgarsAttachmentRcd(data)
                    .then(getEgarsAttachmentRcdOnSuccess)
                    .catch(getEgarsAttachmentRcdOnError)
                    .finally(function(){
                        spinnerService.hide('#cenas');
                        vm.allChecked = false;                        
                    });

            }else{
                utilsService.notifyInvalidFormValidation();
            }
        };

        vm.onOriginChange = function (establishment){
            spinnerService.show('#selectedOriginData');
            establishmentService.getEstablishment(establishment.uniqueId)
                .then((result)=>{
                    vm.originName = result.data.Name;
                    vm.originAddress = result.data.Address.DisplayAddress;
                    vm.originVat = result.data.Vat;
                    vm.originApa = result.data.ApaCode;
                    vm.originPhone = result.data.Phone;
                    vm.originEmail = result.data.Email;
                    vm.originFax = result.data.Fax;
                })
                .catch((error)=>{

                })
                .finally(()=>{
                    spinnerService.hide('#selectedOriginData');
                });
        }

        vm.onDestinChange = function (establishment){
            spinnerService.show('#selectedDestinData');
            establishmentService.getDefaultEstablishment(establishment.uniqueId)
                .then((result)=>{
                    vm.destinName = result.data.Name;
                    vm.destinAddress = result.data.Address.DisplayAddress;
                    vm.destinVat = result.data.Vat;
                    vm.destinApa = result.data.ApaCode;
                    vm.destinPhone = result.data.Phone;
                    vm.destinEmail = result.data.Email;
                    vm.destinFax = result.data.Fax; 
                })
                .catch((error)=>{

                })
                .finally(()=>{
                    spinnerService.hide('#selectedDestinData');
                });
        }

        vm.onPeriodChange = function(selectedPeriod){
            vm.periodKey = selectedPeriod.key;
        }

        vm.onEgarClicked = function (eGar){
            //check if any unchecked
            var uncheckedEgars = $filter('filter')(vm.eGars, function(eGar){
                return !eGar.Checked;
            });

            if(uncheckedEgars && uncheckedEgars.length > 0){
                vm.allChecked = false;
            }else{
                vm.allChecked = true;
            }

        }

        vm.checkTransporterOrigin = false;
        vm.clickTransporterOrigin = function(){
            vm.checkTransporterOrigin = !vm.checkTransporterOrigin;
            vm.checkTransporterDestin = false;

            if(vm.checkTransporterOrigin && vm.selectedOrigin){
                vm.transporterVat = vm.originVat;
                vm.transporterName = vm.originName;
                vm.transporterAddress = vm.originAddress;
            }else{
                vm.transporterVat = null;
                vm.transporterName = null;
                vm.transporterAddress = null;
            }
        }

        vm.checkTransporterDestin = false;
            vm.clickTransporterDestin = function(){
            vm.checkTransporterDestin = !vm.checkTransporterDestin;
            vm.checkTransporterOrigin = false;

            if(vm.checkTransporterDestin && vm.selectedDestin){
                vm.transporterVat = vm.destinVat;
                vm.transporterName = vm.destinName;
                vm.transporterAddress = vm.destinAddress;
            }else{
                vm.transporterVat = null;
                vm.transporterName = null;
                vm.transporterAddress = null;
            }
        }

        vm.downloadFile = function(extension){
            var selectedEgars = $filter('filter')(vm.eGars, function(eGar){
                return eGar.Checked;
            });
            
            if(!selectedEgars || selectedEgars.length <= 0) {
                utilsService.notifyWarning('Por favor selecione pelo menos uma e-Gar');
                return;
            }

            var data = createRequestObject();

            data.Egars = [];
            angular.forEach(selectedEgars, function(eGar){
                data.Egars.push(eGar.UniqueId);
            });

            spinnerService.show('#cenas');
            garsAttachmentService
                .downloadFile(data)
                .then(function(result){
                    utilsService.notifySuccess('Certificado emitido com sucesso');
                })
                .catch(function(error){
                    utilsService.notifyError('Não foi possível emitir o certificado. <br> Se esta situação persistir por favor contacte o suporte.');
                })
                .finally(function(){
                    spinnerService.hide('#cenas');
                });
        }

        vm.onAllEgarClicked = function(){
            if(!vm.eGars || vm.eGars.length === 0){
                return;
            }

            angular.forEach(vm.eGars, function(eGar){
                eGar.Checked = vm.allChecked;
            });
        }

        function createRequestObject(){
            var data = {};

            data.Period = vm.periodKey;
            data.DestinAddress = vm.destinAddress;
            data.DestinName = vm.destinName;
            data.DestinApa = vm.destinApa;
            data.DestinEmail = vm.destinEmail;
            data.DestinFax = vm.destinFax;
            data.DestinPhone = vm.destinPhone;
            data.DestinLicense = vm.destinLicense;
            data.DestinVat = vm.destinVat;

            data.OriginAddress = vm.originAddress;
            data.OriginName = vm.originName;
            data.OriginVat = vm.originVat;
            data.OriginLicence = vm.originLicense;
            data.OriginObra = vm.originObra;

            data.TransporterName = vm.transporterName;
            data.TransporterAddress = vm.transporterAddress;
            data.TransporterVat = vm.transporterVat;

            return data;
        }

        function getEgarsAttachmentRcdOnSuccess(result){
            vm.eGars =  [];
            angular.forEach(result.data.EGars, function (item) {
                vm.eGars.push(item);
            });
        }

        function getEgarsAttachmentRcdOnError(error){
            vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            vm.serverApplicationsErrors = utilsService.parseErrors(error.data._applicationErrors);

            utilsService.notifyWarning('Não foi possivel pesquisar as egars.');
        }

        // function getEstablishments(){
        //     garsService
        //         .getAvailableEstablishments()
        //         .then(function(result){
        //             angular.forEach(result.data.AvailableEstablishments, function(item){
        //                 if(item.IsDefault){
        //                     vm.accountEstablishments.push(item);
        //                 }
        //                 vm.clientEstablishments.push(item);
        //             });
        //         });
        //}

        $scope.$watchGroup(['$ctrl.selectedDestin', '$ctrl.destinVat', '$ctrl.destinApa',
                            '$ctrl.periodKey',
                            '$ctrl.selectedOrigin', '$ctrl.originVat', '$ctrl.transporterVat'], function (newVal,oldVal) { 
            vm.eGars = [];
            vm.submitted = false;
        }, true);
    }
})();