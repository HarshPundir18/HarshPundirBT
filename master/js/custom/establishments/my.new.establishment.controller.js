(function () {
	'use strict';

	angular
		.module('custom')
		.controller('myNewEstablishmentController', myNewEstablishmentController);

	myNewEstablishmentController.$inject = ['$rootScope', '$scope', '$q', '$state',
		'establishmentService', 'spinnerService', 'utilsService',
		'translationService', 'Notify'];

	function myNewEstablishmentController($rootScope, $scope, $q, $state,
		establishmentService, spinnerService, utilsService,
		translationService, Notify) {

		var vm = this;

		vm.accessValidatedMsg = "Validar acesso";
		vm.accessInvalidMsg = null;
		vm.accessInvalid = true;

		vm.serverValidationErrors = [];

		vm.validateInput = function (name, type) {
			var input = vm.formValidate[name];

			var errorType = input.$error[type];

			return (input.$dirty || vm.submitted) && errorType;
		};

		vm.submitted = false;

		// Submit form
		vm.submitForm = function () {
			vm.submitted = true;
			if (vm.formValidate.$valid) {
				vm.accessInvalidMsg = null;
				var data = {};

				data.Vat = vm.vat;
				data.Apa = vm.apa.ApaCode;
				data.PrimaryCae = vm.primaryCae;
				data.SecondaryCae = vm.secondaryCae;
				data.Name = vm.establishmentName;
				data.Phone = vm.phone;
				data.Fax = vm.fax;
				data.Mobile = vm.mobile;
				data.Email = vm.email;
				data.ApaAccess = vm.access;

				data.Street = vm.address;
				data.PostalCode = vm.postalCode;
				data.Locale = vm.locale;
				data.City = vm.city;

				data.Obs = vm.obs;

				spinnerService.show('.panel-body');

				establishmentService
					.createDefault(data)
					.then(createDefaultOnSuccess)
					.catch(createDefaultOnError)
					.finally(function () {
						spinnerService.hide('.panel-body');
					});

			} else {
				console.log('Not valid!!');
				return false;
			}
		};

		vm.validateAccess = function () {
			vm.serverValidationErrors['ApaAccess'] = null;
			vm.accessInvalidMsg = null;

			spinnerService.show('.panel-body');
			establishmentService
				.validateMyEstablishmentAccess(vm.vat, vm.access)
				.then(validateAccessOnSuccess)
				.catch(validateAccessOnError)
				.finally(function () {
					spinnerService.hide('.panel-body');
				});
		}

		vm.cancel = function () {
			$state.go('app.myEstablishmentsOverview');
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
			vm.apa = null;
			vm.establishments = [];
        }  

		function createDefaultOnSuccess(result) {
			$state.go('app.dashboard');
			Notify.alert('<em class="fa fa-check"></em> Estabelecimento actualizado!', { status: 'success' });
		}

		function createDefaultOnError(error){
			vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
		}
	}
})();
