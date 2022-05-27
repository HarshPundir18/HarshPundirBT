(function () {
	'use strict';

	angular
		.module('custom')
		.controller('userCreateController', userCreateController);

    userCreateController.$inject = ['$stateParams', '$scope', '$state', 'userService', 'utilsService',
									'Notify','spinnerService', 'translationService'];
	function userCreateController($stateParams, $scope, $state, userService, utilsService,
									Notify, spinnerService, translationService) {

		//VM stuff
		var vm = this;
		vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        
        if($stateParams.id){
            userService
                .getUser($stateParams.id)
                .then((result)=>{
                    vm.user = result.data;
                })
                .catch((error)=>{
                    utilsService.notifyWarning(translationService.translate('error'))
                })
                .finally(()=>{

                })
                ;
        }

		vm.validateInput = function (name, type) {
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
				data.Email = vm.email;
				data.Username = vm.username;
				data.Password = vm.password;
				data.ConfirmPassword = vm.confirmPassword;
				if(vm.selectedVehicle){
					data.SelectedVehicleId = vm.selectedVehicle.key;
				}

                spinnerService.show('.panel-body');

                userService
                    .create(data)
                    .then(createUserOnSuccess, createUserOnError)
                    .finally(spinnerService.hide('.panel-body'));

            } else {
              console.log('Not valid!!');
              return false;
            }
        };


		//
		activate();

		//CALLBACKS
		function createUserOnSuccess(result){
			$state.go('app.usersOverview');
            Notify.alert('<em class="fa fa-check"></em> Utilizador criado!', { status: 'success'});
		}

		function createUserOnError(error, status){
			vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);
		}

		//PRIVATES
		function activate() {

		}

		//SCOPE stuff
	}
})();