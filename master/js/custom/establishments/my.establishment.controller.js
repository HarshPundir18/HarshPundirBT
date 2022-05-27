(function() {
    'use strict';

    angular
        .module('custom')
        .controller('myEstablishmentController', myEstablishmentController);

    myEstablishmentController.$inject = ['$rootScope', '$scope', '$q', '$state', 'oauthService',
                                        'establishmentService', 'spinnerService', 'translationService',
                                        'Notify'];
    function myEstablishmentController($rootScope, $scope, $q, $state, oauthService,
                                        establishmentService, spinnerService, translationService,
                                        Notify) {
        
        var vm = this;
        vm.myEstablishment = null;
        vm.establishments = [];
        vm.apaCodeReadOnly = vm.establishments.length == 0;
        vm.accessValidatedMsg = "Validar acesso";
        vm.accessInvalidMsg = null;
        vm.accessInvalid = true;

        vm.serverValidationErrors = [];

        if(oauthService.hasDefaultEstablishment()){
            $state.go('app.myEditEstablishment');
        }

        vm.vatChanged = function(){
            if(vm.vat && vm.vat.length == 9){
                // establishmentService
                //     .getRemoteEstablishmentsByVat(vm.vat)
                //     .then(function(result){
                        
                //     });
            }else{
                vm.establishments = [];
                vm.access = null;
            }

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
                vm.accessInvalidMsg = null;
                var data = {};

                data.OrganizationName = vm.organizationName;
                data.Vat = vm.vat;
                data.PrimaryCae = vm.primaryCae;
                data.SecondaryCae = vm.secondaryCae;

                data.Apa = vm.apa.ApaCode;
                data.Name = vm.establishmentName;
                data.Phone = vm.phone;
                data.Fax = vm.fax;
                data.Mobile = vm.mobile;
                data.Email = vm.email;
                data.ApaPassword = vm.access;
                
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

                spinnerService.show('.panel-body');

                establishmentService
                        .createDefault(data)
                        .then(createDefaultEstablishmentOnSuccess)
                        .catch(createDefaultEstablishmentOnError)
                        .finally(function(){
                            spinnerService.hide('.panel-body');
                        });

            } else {
              console.log('Not valid!!');
              return false;
            }
        };
        
        vm.validateAccess = function(){
            vm.serverValidationErrors['ApaAccess'] = null;
            vm.accessInvalidMsg = null;

            spinnerService.show('.panel-body');
            establishmentService
                .validateMyEstablishmentAccess(vm.vat, vm.access)
                .then(validateAccessOnSuccess)
                .catch(validateAccessOnError)
                .finally(function(){
                    spinnerService.hide('.panel-body');
                });
        }
    
        function validateAccessOnSuccess(result){
            vm.establishments = [];
            vm.accessInvalid = false;
            var items = result.data.Establishments;
            angular.forEach(items, function(item){
                vm.establishments.push(item);
            });
        }

        function validateAccessOnError(error){
            vm.accessInvalid = true;
            vm.accessInvalidMsg = "Inválido";
        }        

        function createDefaultEstablishmentOnSuccess(result){
            oauthService.setDefaultEstablishment("created");
            $state.go('app.dashboard');
            $rootScope.$broadcast('reloadMenus');
            Notify.alert('<em class="fa fa-check"></em> Estabelecimento criado!', { status: 'success'});
        }

        function createDefaultEstablishmentOnError(error){
            var validationErrors = error.data._validationErrors;
            if(validationErrors){
                for (var i = 0; i < validationErrors.length; i++) { 
                    vm.serverValidationErrors[validationErrors[i].Field] =  translationService.translate(validationErrors[i].Message);
                }
            }

            var applicationErrors = error.data._applicationErrors;
            if(applicationErrors){
                for (var i = 0; i < applicationErrors.length; i++) { 
                    vm.serverValidationErrors[applicationErrors[i].Field] = translationService.translate(applicationErrors[i].Message);
                }
            }
        }
    }
})();
