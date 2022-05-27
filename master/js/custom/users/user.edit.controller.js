(function () {
	'use strict';

	angular
		.module('custom')
		.controller('userEditController', userEditController);

    userEditController.$inject = ['$stateParams', '$scope', '$state', '$filter',
                                    'userService', 'utilsService',
									'Notify','spinnerService', 'translationService'];
    function userEditController($stateParams, $scope, $state, $filter,
                                    userService, utilsService,
									Notify, spinnerService, translationService) {

		//VM stuff
        var vm = this;
        vm.roles = [];
        vm.user = null;
		vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        
        if($stateParams.id){
            userService
                .getUser($stateParams.id)
                .then((result)=>{
                    vm.user = result.data.User;
                    if(vm.user.Vehicle){
                        vm.selectedVehicleKey = vm.user.Vehicle.UniqueId;
                    }
                })
                .catch((error)=>{
                    utilsService.notifyWarning(translationService.translate('error'))
                })
                .finally(()=>{

                })
                ;

            userService
                .getRoles()
                .then((result)=>{
                    vm.roles = result.data; 
                })
                .catch((error)=>{
                    utilsService.notifyWarning(translationService.translate('error'));
                });


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
            spinnerService.show('.panel-body');

            if (vm.formValidate.$valid) {
                var data = {};            
                data.RoleId = vm.selectedRole;
       
                if(vm.selectedVehicle){
                    data.SelectedVehicleId = vm.selectedVehicle.key;
                }

                userService
                    .update($stateParams.id, data)
                    .then(updateUserOnSuccess, updateUserOnError)
                    .finally(()=>{
                        spinnerService.hide('.panel-body');
                    });

            } else {
              console.log('Not valid!!');
              return false;
            }
        };

        vm.selectedVehicleOnChange = function(obj) {
            //console.log(obj)
        }


		//
		activate();

		//CALLBACKS
		function updateUserOnSuccess(result){
            utilsService.notifySuccess('Utilizador com sucesso');
			$state.go('app.usersOverview');
		}

		function updateUserOnError(error, status){
			vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);
		}

		//PRIVATES
		function activate() {

        }
        
        function canSetRole(){
            return vm.roles.length > 0 && vm.user;
        }

        $scope.$watchGroup(['$ctrl.roles', '$ctrl.user'], function (newVal,oldVal) { 
            if(canSetRole()){
                var userRoleUniqueId = vm.user.Roles[0].UniqueId;
                var filtered = $filter('filter')(vm.roles, { 'UniqueId': userRoleUniqueId });
                if(filtered && filtered[0]){
                    //set the item
                    vm.selectedRole = filtered[0].UniqueId;
                }
            }
        }, true);

	}
})();