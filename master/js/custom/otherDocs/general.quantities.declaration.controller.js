(function() {
    'use strict';

    angular
        .module('custom')
        .controller('generalQuantitiesDeclarationController', generalQuantitiesDeclarationController);

    generalQuantitiesDeclarationController.$inject = ['$scope', '$filter', '$state',
        'otherDocsService', 'spinnerService', 'utilsService', 'dateService', 'ngDialog', 'translationService',
        'SMG_ESTABLISHMENT_TYPES', 
        'SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES',
        'SMG_TEXT_SEARCH_TYPES',
        'SMG_QUANTITIES_DECLARATION_TYPES'];
    function generalQuantitiesDeclarationController($scope, $filter, $state,
        otherDocsService, spinnerService, utilsService, dateService, ngDialog, translationService,
        SMG_ESTABLISHMENT_TYPES, 
        SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES,
        SMG_TEXT_SEARCH_TYPES,
        SMG_QUANTITIES_DECLARATION_TYPES) {
        
        //VM stuff
        var vm = this;
        vm.SMG_ESTABLISHMENT_TYPES = SMG_ESTABLISHMENT_TYPES;
        vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES = SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES;
        vm.SMG_TEXT_SEARCH_TYPES = SMG_TEXT_SEARCH_TYPES;

        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        vm.selectedOriginKey = null;
        vm.consolidatedPdf = false;
        vm.emissionTypeSelectionError = false;
        vm.selectedYear = null;


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

            if (vm.formValidate.$valid && 
                vm.selectedType != undefined
                && !this.shouldShowEstablishmentSelecterError()
                && this.isValidDate()) {

                if(!vm.isConfirmed){
                    var obj = {
                        Type: SMG_QUANTITIES_DECLARATION_TYPES.General,
                        StartDate: vm.startDate,
                        EndDate: vm.endDate,
                        EmissionType: vm.selectedType,
                        ConsolidatedPdf: vm.consolidatedPdf,
                        establishment: vm.selectedOriginObj,
                        SendByEmail: vm.sendByEmail,
                        Description: vm.description

                    };
                    showConfirmDialog(obj);
                    return;
                }

                var data = {
                    Type: SMG_QUANTITIES_DECLARATION_TYPES.General,
                    StartDate: vm.startDate,
                    EndDate: vm.endDate,
                    EmissionType: vm.selectedType,
                    ConsolidatedPdf:  vm.consolidatedPdf,
                    EstablishmentId: vm.selectedOriginObj ? vm.selectedOriginObj.uniqueId : null,
                    Vat:  vm.selectedOriginObj ? vm.selectedOriginObj.vat : null,
                    SendByEmail: vm.sendByEmail,
                    Description: vm.description
                };

                if(data.EmissionType == vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.AllEstablishments){
                    data.ConsolidatedPdf = true;
                }

                spinnerService.show('#quantitiesDeclaration');
                otherDocsService
                    .requestQuantitiesDeclaration(data)
                    .then(onRequestGeneralQuantitiesDeclarationSuccess)
                    .catch(onRequestGeneralQuantitiesDeclarationeError)
                    .finally(function(){
                        spinnerService.hide('#quantitiesDeclaration');                   
                    });

            }else{
                utilsService.notifyInvalidFormValidation();
            }
        };


        vm.shouldShowEstablishmentSelecterError = function(){
            var result = vm.submitted 
                && establishmentMustBeSelected() 
                && (vm.selectedOriginObj == null || vm.selectedOriginObj == undefined);
            return result;
        }

        vm.onEmissionTypeChange = function(type){
            if(type == vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.AllEstablishments){
                vm.consolidatedPdf = true;
            }

            vm.selectedOrigin = null;
            vm.selectedOriginObj = null;
        }

        vm.isValidDate = ()=>{
            vm.invalidDateErrorMessage = null;
            
            if(vm.submitted && !datesAreDefined()){
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


        vm.onSelectedOriginChange = (obj) => {
            if(obj.resultValue && obj.resultValue.vat){
                if(vm.selectedType == vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.AllEstablishmentsWithVat){
                    if(obj.resultValue.vat){
                        vm.selectedOrigin = `${obj.resultValue.vat} - ${obj.resultValue.name}`;
                        vm.selectedOriginErrorMesssage = null;
                    }else{
                        vm.selectedOriginErrorMesssage = `O estabelecimento não tem NIF definido`;
                    }
                    
                }
                else if(vm.selectedType == vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.SingleEstablishment){
                    if(obj.resultValue.apaCode){
                        vm.selectedOrigin = `${obj.resultValue.apaCode} - ${obj.resultValue.name}` ;
                        vm.selectedOriginErrorMesssage = null;
                    }else{
                        vm.selectedOriginErrorMesssage = `O estabelecimento não tem APA definido`;
                    }
                    
                }
            }
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

        var datesAreDefined = () => { 
            return vm.startDate != undefined && vm.endDate != undefined 
        }


        function showConfirmDialog(obj){
            var dialog = ngDialog.open({
                template: '/app/custom/otherDocs/exsitu.otherDocsExSituQuantities.confirmDialog.html',
                className: 'ngdialog-theme-default request request-acceptance',
                width: 600,
                showClose: false,
                controller: 'QuantitiesDeclarationDialogController as vm',
                closeByNavigation: false,
                preCloseCallback: 'preCloseCallbackOnScope',
                scope: $scope,
                resolve : {
                    data: function (){ return obj; }
                },
                
            });
            
        
            dialog.closePromise.then(function (result) {
                if(result.value == true){
                    vm.isConfirmed = true;
                    vm.submitForm();
                }
            });


        }
        
        function onRequestGeneralQuantitiesDeclarationSuccess (result){
            utilsService.notifySuccess('O pedido foi registado com sucesso!' +
                '<br>Pode acompanhe o progresso da geração na área ' +
                '<br>"Geração de Documentos" <em class="mar-left10 fa fa-folder-open"></em>');

                $state.go('app.dashboard');
        }

        function onRequestGeneralQuantitiesDeclarationeError(error){
            
            if(error.status >= 500){
                utilsService.notifyError('Não foi possível o pedido. <br> Se esta situação persistir por favor contacte o suporte.');   
            } else {
                if(error.data._applicationErrors && error.data._applicationErrors.length > 0){
                    vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);
                } else if(error.data._validationErrors && error.data._validationErrors.length > 0){
                    vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
                }
            }
        }

        function establishmentMustBeSelected(){
            if(vm.selectedType == vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.SingleEstablishment
            || vm.selectedType == vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.AllEstablishmentsWithVat){
                    return true
            }

            return false;
        }

        $scope.preCloseCallbackOnScope = function (a, b, c, d) {

        };

    }
})();