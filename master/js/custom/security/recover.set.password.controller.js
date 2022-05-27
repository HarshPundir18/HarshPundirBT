(function () {
	'use strict';

	angular
		.module('custom')
		.controller('recoverSetPasswordController', recoverSetPasswordController);

	recoverSetPasswordController.$inject = ['$state', '$stateParams', 'securityService', 
				'vcRecaptchaService', 'spinnerService', 'utilsService', 'oauthService',
				'translationService'];

	function recoverSetPasswordController($state, $stateParams, securityService, 
				vcRecaptchaService, spinnerService, utilsService, oauthService,
				translationService) {

		var vm = this;
		vm.recaptchaPublicKey = window.appSettings.recaptchaSiteKey;
		vm.serverValidationErrors = [];
		vm.token = $stateParams.token;

		activate();

		////////////////

		function activate() {

			// bind here all data from the form
			vm.account = {};

			vm.recover = function () {
				if (vm.recoverForm.$valid) {
					var data = {};
					data.ClientCode = vm.clientCode;
					data.Email = vm.email;
					data.Password = vm.pass;
					data.ConfirmPassword = vm.confirmPass;
					data.Token = vm.token;
					data.gRecaptchaResponse = vcRecaptchaService.getResponse();

					spinnerService.show('.panel-body');
					securityService
						.recoverSetPassword(data)
						.then(onRecoverSetPasswordSuccess)
						.catch(onRecoverSetPasswordError)
						.finally(function () { spinnerService.hide('.panel-body') });
				}
				else {
					// set as dirty if the user click directly to login so we show the validation messages
					/*jshint -W106*/
					vm.recoverForm.clientCode.$dirty = true;
					vm.recoverForm.email.$dirty = true;
					vm.recoverForm.pass.$dirty = true;
					vm.recoverForm.confirmPass.$dirty = true;
				}
			};
		}

		function onRecoverSetPasswordSuccess(result) {
			utilsService.notifySuccess('A sua password foi alterada com sucesso!');
			oauthService.logOut();
			$state.go('page.login');
		}

		function onRecoverSetPasswordError(error) {
			var msg = 'Existem Erros no pedido:';
			if(error.data && error.data._validationErrors) {
				for(var i=0; i<error.data._validationErrors.length; i++) {
					var item = error.data._validationErrors[i];
					msg += '<br>' + translationService.translate(item.Message);
				}
			}
					
			utilsService.notifyWarning(msg);
		}
	}
})();
