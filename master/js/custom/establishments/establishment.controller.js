(function() {
    'use strict';

    angular
        .module('custom')
        .controller('establishmentController', establishmentController);

    establishmentController.$inject = ['$state', '$scope', '$q', '$stateParams',
                                        'establishmentService', 'spinnerService',  'utilsService',
                                        'Notify', 'ngDialog'];
    function establishmentController($state, $scope, $q, $stateParams,
                                        establishmentService, spinnerService, utilsService,
                                        Notify, ngDialog) {
        
        var vm = this;
        //vm.establishment = null;
        vm.vatEstablishments = [];
        vm.apaAccess = null;
        vm.accessInvalidMsg = null;
        vm.accessInvalid = true;
    
        vm.serverValidationErrors = [];

        vm.apaCodeChanged = function(){
            vm.organizationName = 'Organização - ' + vm.apa.Name;
            vm.establishmentName = vm.apa.Name;
            vm.address = vm.apa.Address;
            vm.postalCode = vm.apa.PostalCode;
            vm.locale = vm.apa.Locale;
            vm.city = vm.apa.Locale;
        };

        vm.vatChanged = function(){
            if(vm.vat && vm.vat.length == 9){
                spinnerService.show('#div-apa');
                establishmentService
                    .getRemoteEstablishmentsByVat(vm.vat)
                    .then(function(result){
                        vm.vatEstablishments = [];
                        angular.forEach(result.data.result.Establishments, function(establishment){
                            vm.vatEstablishments.push(establishment);
                        });
                    })
                    .catch(function(){

                    })
                    .finally(function(){
                        spinnerService.hide('#div-apa');
                    });
            }else{
                vm.vatEstablishments = [];
                vm.apaAccess = null;
            }

        }

        vm.validateAccess = function(){
            vm.serverValidationErrors['ApaAccess'] = null;
            vm.accessInvalidMsg = null;

            spinnerService.show('.panel-body');
            establishmentService
                .validateAccess(vm.vat, vm.apaAccess)
                .then(function (result){
                    vm.accessInvalid = false;
                })
                .catch(function (error){
                    vm.accessInvalid = true;
                    vm.accessInvalidMsg = "Inválido";
                } )
                .finally(function(){
                    spinnerService.hide('.panel-body');
                });
        }

        vm.validateInput = function(name, type) {
            
            var input = vm.formValidate[name];

            var errorType = input.$error[type];

            return (input.$dirty || vm.submitted) && errorType;
          };

        vm.submitted = false;
        
        // Submit form
        vm.submitForm = function() {
            vm.submitted = true;
            if (vm.formValidate.$valid) {
                var data = {};
                
                data.OrganizationName = vm.organizationName;
                data.Vat = vm.vat;
                data.PrimaryCae = vm.primaryCae;
                data.SecondaryCae = vm.secondaryCae;
                
                data.Apa = vm.apa ? vm.apa.ApaCode : null;
                data.Name = vm.establishmentName;
                data.Phone = vm.phone;
                data.Fax = vm.fax;
                data.Mobile = vm.mobile;
                data.Email = vm.email;
                //data.StartDate = vm.formValidate['startDate'].$viewValue;
                data.ApaAccess = vm.apaAccess;

                data.Street = vm.address;
                data.PostalCode = vm.postalCode;
                data.Locale = vm.locale;
                data.City = vm.city;

                data.Obs = vm.obs;
                
                data.ContactPersonName1 = vm.person1Name;
                data.ContactPersonEmail1 = vm.person1Email;
                data.ContactPersonMobile1 = vm.person1Mobile;

                data.ContactPersonName2 = vm.person2Name;
                data.ContactPersonEmail2 = vm.person2Email;
                data.ContactPersonMobile2 = vm.person2Mobile

                data.IsContractor = vm.contractor;

                spinnerService.show('.panel-body');

                establishmentService
                    .create(data)
                    .then(createEstablishmentOnSuccess, createEstablishmentOnError)
                    .finally(spinnerService.hide('.panel-body'));

            } else {
              console.log('Not valid!!');
              return false;
            }
        };
        
        vm.cancel = function(){
            $state.go('app.establishmentOverview');
        }
    
        vm.open = function() {
            ngDialog.open({
              template: 'modalDialogId',
              className: 'ngdialog-theme-default',
              controller: 'establishmentDialogController',
              resolve : {
                  apaCode: function (){ return '123';}
              }
            });
          };
    
        function createEstablishmentOnSuccess(result){
            $state.go('app.establishmentOverview');
            Notify.alert('<em class="fa fa-check"></em> Estabelecimento criado!', { status: 'success'});
        }

        function createEstablishmentOnError(error, status){
            vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);

            if(
                (error.data._validationErrors && error.data._validationErrors.length > 0) || 
                (error.data._applicationErrors && error.data._applicationErrors.length > 0)
            ){
                Notify.alert( 
                    '<em class="fa fa-times"></em> Existem erros de validação, por favor confira o formulário.', 
                    { status: 'warning'}
                );
            }

            var notificationErrorMessage = '';
            var externalErrors = error.data._externalErrors;
            if(externalErrors){
                utilsService.parseAndNotifyExternalErrors(externalErrors);
                ngDialog.close();
            }
        } 
    }
})();
