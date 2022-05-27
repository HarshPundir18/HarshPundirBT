(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garAuthorizeDialogController', garAuthorizeDialogController);

    garAuthorizeDialogController.$inject = ['$window', '$rootScope', '$scope', '$http', '$state', '$filter', 'ngDialog',
                                    'garsService', 'spinnerService', 'translationService', 'utilsService', 'gar', 'hash'];
    function garAuthorizeDialogController($window, $rootScope, $scope, $http, $state, $filter, ngDialog,
                                    garsService, spinnerService, translationService, utilsService, gar, hash) {

        //VM  public stuff
        var vm = this;
        
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
		vm.gar = gar;
        vm.hash = hash;

        vm.getFile = function(url){
            $window.open(url, '_blank');
        }

		vm.validateInput = function(name, type) {
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

		vm.submitted = false;
        vm.submitForm = function() {

            vm.serverValidationErrors = [];
            vm.submitted = true;
            if (vm.formValidate.$valid) {
                var data = {};
				data.Vat = vm.gar.Origin.Nif;
				data.ApaAccess = vm.apaAccess;

                garsService
					.anonymousAuthorize(vm.gar.UniqueId, vm.hash, data)
					.then(authorizeOnSuccess)
					.catch(authorizeOnError)
                    .finally(ngDialog.close());
            }
        };

        //
        activate();


        //PRIVATES
        function activate(){

        }

		//CALLBAKCS
		function authorizeOnSuccess(result){
			utilsService.notifySuccess('Autorização efectuada com sucesso!')
            $rootScope.$broadcast('reloadRequestAuthorization');
		}

		function authorizeOnError(error){
			vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
			vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);
			
            var externalErrors = error.data._externalErrors;
            if(externalErrors){
                utilsService.parseAndNotifyExternalErrors(externalErrors);
            }

            ngDialog.close();
		}

        //SCOPE stuff
    }
})();