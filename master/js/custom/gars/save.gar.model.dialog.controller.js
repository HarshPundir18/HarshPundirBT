
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('saveGarModelDialogController', saveGarModelDialogController);

    saveGarModelDialogController.$inject = ['$window', '$rootScope', '$scope', '$compile', '$http', '$state', '$filter',
                                    'garsService', 'spinnerService', 'translationService', 'utilsService', 'ngDialog', 'garModel'];
    function saveGarModelDialogController($window, $rootScope, $scope, $compile, $http, $state, $filter,
                                    garsService, spinnerService, translationService, utilsService, ngDialog,
                                    garModel) {
        
        var requestInFlight = null;
        //VM stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        vm.garModel = garModel;

        vm.validateInput = function(name, type) {
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

        vm.submitForm = function() {
            vm.serverValidationErrors = [];
            vm.submitted = true;
            if (vm.formValidate.$valid) {
                if(requestInFlight){
                    console.log('request is in flight...');
                    return;
                }

                spinnerService.show('.ngdialog-message');

				vm.garModel.modelName = vm.modelName;
                requestInFlight =
					garsService
						.saveEgarModel(vm.garModel)
						.then(saveEgarModelOnSuccess)
						.catch(saveEgarModelOnError)
						.finally(function(){ spinnerService.hide('.ngdialog-message'); });
            }
        };

        //activate


        //CALLBACKS

        //PRIVATES
        function saveModel(){
            
        }

        function saveEgarModelOnSuccess(result){
            utilsService.notifySuccess('Modelo gravado com sucesso!');
            $scope.closeThisDialog('saveEgarModelOnSuccess');
        }

        function saveEgarModelOnError(error){
            vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
			vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);
        }

        //SCOPE stuff
    }
})();