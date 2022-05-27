(function() {
    'use strict';

    angular
        .module('custom')
        .controller('exSituQuantitiesDeclarationController', exSituQuantitiesDeclarationController);

        exSituQuantitiesDeclarationController.$inject = ['$scope', '$filter', '$state',
        'otherDocsService', 'spinnerService', 'utilsService', 'dateService', 'ngDialog',
        'SMG_ESTABLISHMENT_TYPES', 'SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES', 'SMG_QUANTITIES_DECLARATION_TYPES'];
    function exSituQuantitiesDeclarationController($scope, $filter, $state,
        otherDocsService, spinnerService, utilsService, dateService, ngDialog,
        SMG_ESTABLISHMENT_TYPES, 
        SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES,
        SMG_QUANTITIES_DECLARATION_TYPES) {
        
        //VM stuff
        var vm = this;
        vm.SMG_ESTABLISHMENT_TYPES = SMG_ESTABLISHMENT_TYPES;
        vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES = SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES;

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
                && !this.checkIfValidPeriod()) {

                if(!vm.isConfirmed){
                    var obj = {
                        Type: SMG_QUANTITIES_DECLARATION_TYPES.ExSitu,
                        StartDate: vm.startDate,
                        EndDate: vm.endDate,
                        EmissionType: vm.selectedType,
                        ConsolidatedPdf: vm.consolidatedPdf,
                        establishment: vm.selectedOrigin,
                        SendByEmail: vm.sendByEmail,
                        Description: vm.description

                    };
                    showConfirmDialog(obj);
                    return;
                }

                var data = {
                    Type: SMG_QUANTITIES_DECLARATION_TYPES.ExSitu,
                    StartDate: vm.startDate,
                    EndDate: vm.endDate,
                    EmissionType: vm.selectedType,
                    ConsolidatedPdf:  vm.consolidatedPdf,
                    EstablishmentId: vm.selectedOrigin ? vm.selectedOrigin.uniqueId : null,
                    Vat:  vm.selectedOrigin ? vm.selectedOrigin.vat : null,
                    SendByEmail: vm.sendByEmail,
                    Description: vm.description
                };

                if(data.EmissionType == vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.AllEstablishments){
                    data.ConsolidatedPdf = true;
                }

                spinnerService.show('#quantitiesDeclaration');
                otherDocsService
                    .requestQuantitiesDeclaration(data)
                    .then(onRequestExSituQuantitiesDeclarationSuccess)
                    .catch(onRequestExSituQuantitiesDeclarationeError)
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
                && (vm.selectedOrigin == null || vm.selectedOrigin == undefined);
            return result;
        }

        vm.onEmissionTypeChange = function(type){
            if(type == vm.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.AllEstablishments){
                vm.consolidatedPdf = true;
            }
        }


        vm.checkIfValidPeriod = function(){
            if(vm.startDate && vm.endDate){
                var daysDiff = dateService.getDaysDiff(vm.startDate, vm.endDate);
                return daysDiff < 0 || daysDiff > 366
            }
            return false;
        }

        vm.cancel = function(){
            console.log('cancel')
        }


        function showConfirmDialog(obj){
            var dialog = ngDialog.open({
                template: '/app/custom/otherDocs/exsitu.otherDocsExSituQuantities.confirmDialog.html',
                className: 'ngdialog-theme-default request request-acceptance',
                width: 600,
                showClose: false,
                controller: 'QuantitiesDeclarationDialogController as vm',
                closeByNavigation: false,
                onOpenCallback: 'onOpenCallbackScope',
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
        
        $scope.preCloseCallbackOnScope = function (a, b, c, d) {
            console.log('preCloseCallbackOnScope')

        };
        
        $scope.onOpenCallbackScope = function (a, b, c, d) {
            console.log('onOpenCallbackScope')
        };


        function onRequestExSituQuantitiesDeclarationSuccess (result){
            utilsService.notifySuccess('O pedido foi registado com sucesso!' +
                '<br>Pode acompanhe o progresso da geração na área ' +
                '<br>"Geração de Documentos" <em class="mar-left10 fa fa-folder-open"></em>');

                $state.go('app.dashboard');
        }

        function onRequestExSituQuantitiesDeclarationeError(error){
            
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

    }
})();