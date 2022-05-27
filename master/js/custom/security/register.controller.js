/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('registerController', registerController);

    registerController.$inject = ['$state', 'securityService', 'vcRecaptchaService', 'spinnerService'];
    function registerController($state, securityService, vcRecaptchaService, spinnerService) {

        var vm = this;
        vm.recaptchaPublicKey = window.appSettings.recaptchaSiteKey;
        vm.serverValidationErrors = [];

        activate();

        ////////////////

        function activate() {
          
          // bind here all data from the form
          vm.account = {};
          // place the message if something goes wrong
          vm.authMsg = '';
            
          vm.register = function() {
            vm.authMsg = '';
            if(vm.registerForm.$valid) {
              var data = {};
              data.username = vm.account.username;
              data.email = vm.account.email;
              data.password = vm.register.password;
              data.confirmPassword = vm.register.password_confirm;
              data.clientCode = vm.account.clientCode;
              data.agreedTerms = vm.account.agreed;
              data.gRecaptchaResponse = vcRecaptchaService.getResponse();

              spinnerService.show('.panel-body');
              securityService
                    .register(data)
                    .then(onRegisterSuccess)
                    .catch(onRegisterError)
                    .finally(function(){ spinnerService.hide('.panel-body') });
            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.registerForm.account_username.$dirty = true;
              vm.registerForm.account_email.$dirty = true;
              vm.registerForm.account_password.$dirty = true;
              vm.registerForm.account_password_confirm.$dirty = true;
              vm.registerForm.account_agreed.$dirty = true;
              vm.registerForm.client_code.$dirty = true;
              vm.registerForm.recaptcha.$dirty = true;
            }
          };
        }

        function onRegisterSuccess(result){
            $state.go('page.login');
        }

        function onRegisterError(error, status){
            var validationErrors = error.data._validationErrors;
            if(validationErrors){
                 for (var i = 0; i < validationErrors.length; i++) { 
                    vm.serverValidationErrors[validationErrors[i].Field] = validationErrors[i].Message;
                 }
            }
        }
    }
})();
