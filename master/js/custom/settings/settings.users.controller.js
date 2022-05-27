(function() {
  'use strict';

  	angular
		.module('custom')
      	.controller('settingsUsersController', settingsUsersController);

 	settingsUsersController.$inject = ['$window', '$rootScope', '$scope', '$compile', '$http', '$state', '$filter',
									'establishmentService', 'userService', 'spinnerService', 
									'translationService', 'utilsService', 'ngDialog'];
	function settingsUsersController($window, $rootScope, $scope, $compile, $http, $state, $filter,
									establishmentService, userService, spinnerService, 
									translationService, utilsService, ngDialog) {
      
		//VM stuff
		var vm = this;
		vm.serverValidationErrors = [];
		vm.serverApplicationErrors = [];

		vm.clientEstablishments = [];
		vm.clientUsers = [];

		//
		activate();

      	//CALLBACKS
		function getClientEstablishmentsOnSuccess(result){

		}

		function getClientEstablishmentsOnError(error, status){
			
		}

		function getUsersOnSuccess(result){
			
			}
			
		function getUsersOnError(error, status){
			
		}

      	//PRIVATES
		function activate(){

			// establishmentService
			// 	.getClientEstblishments()
			// 	.then(getClientEstablishmentsOnSuccess)
			// 	.catch(getClientEstablishmentsOnError);

			// userService
			// 	.getUsers()
			// 	.then(getUsersOnSuccess)
			// 	.catch(getUsersOnError);
		}

      	//SCOPE stuff
	}
})();