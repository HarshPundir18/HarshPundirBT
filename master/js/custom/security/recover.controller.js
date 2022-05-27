(function () {
	'use strict';

	angular
		.module('custom')
		.controller('recoverController', recoverController);

	recoverController.$inject = ['$state', 'securityService', 'vcRecaptchaService', 'spinnerService', 'utilsService'];

	function recoverController($state, securityService, vcRecaptchaService, spinnerService, utilsService) {

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
            
          vm.recover = function() {

            vm.authMsg = '';
            if(vm.recoverForm.$valid) {
              var data = {};
              data.ClientCode = vm.clientCode;
              data.Email = vm.email;
              data.Name = vm.name;
              data.gRecaptchaResponse = vcRecaptchaService.getResponse();

              spinnerService.show('.panel-body');
              securityService
                    .recover(data)
                    .then(onRecoverSuccess)
                    .catch(onRecoverError)
                    .finally(function(){ spinnerService.hide('.panel-body') });
            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.recoverForm.clientCode.$dirty = true;
              vm.recoverForm.email.$dirty = true;
              vm.recoverForm.name.$dirty = true;
            }
          };
        }

        function onRecoverSuccess(result){
            utilsService.notifySuccess('Será enviado um email com instruções para o email ' + vm.email);
            $state.go('page.login');
        }

        function onRecoverError(error, status){
            
        }
	}
})();
