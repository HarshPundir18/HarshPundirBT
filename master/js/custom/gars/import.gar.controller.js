(function () {
	'use strict';

	angular
		.module('custom')
		.controller('importGarController', importGarController);

	importGarController.$inject = ['$state', '$filter',
		'garsService', 'establishmentService', 'spinnerService',
		'translationService', 'utilsService', 'ngDialog'];

	function importGarController($state, $filter,
		garsService, establishmentService, spinnerService, translationService, utilsService, ngDialog, stuff) {

		//VM stuff
		var vm = this;
		vm.serverValidationErrors = [];
		vm.serverApplicationErrors = [];
		vm.selectedOption = {};
		vm.allowedEstablishments = [{ "UniqueId": null, "Name": "Selecione um estabelecimento" }];


		vm.validateInput = function (name, type) {
			if (name === 'selectedEstablishment') {
				return (vm.selectedOption == null || vm.selectedOption.UniqueId == null);
			}
			var input = vm.formValidate[name];
			var errorType = input.$error[type];
			return (input.$dirty || vm.submitted) && errorType;
		};

		vm.submitForm = function () {
			vm.submitted = true;
			if (vm.formValidate.$valid) {
				vm.accessInvalidMsg = null;
				var data = {};

				data.Number = vm.number;
				data.VerificationCode = vm.verificationCode;
				data.EstablishmentId = vm.selectedOption.UniqueId;

				spinnerService.show('.panel-body');

				garsService
					.importEgar(data)
					.then(importEgarOnSuccess)
					.catch(importEgarOnError)
					.finally(function () {
						spinnerService.hide('.panel-body');
					});

			} else {
				console.log('Not valid!!');
				return false;
			}
		};

		//
		activate();

		//CALLBACKS
		function getAllowedClientEstablishmentsOnSuccess(result) {
			for (var i = 0; i < result.data.length; i++) {
				var item = result.data[i];
				vm.allowedEstablishments.push(item);
			}
			vm.selectedOption = vm.allowedEstablishments[0];
		}

		function getAllowedClientEstablishmentsOnError(error) {
		}


		function importEgarOnSuccess(result) {
			if(result.data.ExistsInSystem){
				utilsService.notifySuccess('A e-Gar ' + vm.number + ' já existe no sistema. <br>'+
				'Por favor aceda à lista de e-Gars para consulta.');
			}else{
				utilsService.notifySuccess('A e-Gar ' + vm.number + ' foi importada com sucesso. <br>'+
				'Por favor aceda à lista de e-Gars para consulta.');
			}

		}

		function importEgarOnError(error) {
			var s = '';
			if(vm.allowedEstablishments && vm.allowedEstablishments.length > 1){
				s = '-Estabelecimento selecionado  <br>';
			}
			utilsService.notifyWarning('Não foi possível importar a e-Gar! <br> Por favor confirme : <br> ' + 
			s + 
			'-Número da e-Gar  <br>' +
			'-Código de verificação  <br>');
		}

		//PRIVATES
		function activate() {
			establishmentService
				.getAllowedClientEstablishments()
				.then(getAllowedClientEstablishmentsOnSuccess)
				.catch(getAllowedClientEstablishmentsOnError);

		}

		//SCOPE stuff
	}
})();