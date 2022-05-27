(function() {
    'use strict';

    angular
        .module('custom')
        .controller('anonymousAcceptanceDialogController', anonymousAcceptanceDialogController);

    anonymousAcceptanceDialogController.$inject = ['$window', '$scope', '$state', '$stateParams', 
                                    '$filter', 'ngDialog', 
                                    'garsService', 'spinnerService', 'translationService', 'utilsService',
                                    'gar', 'hash', 'data'];
    function anonymousAcceptanceDialogController($window, $scope, $state, $stateParams, 
                                    $filter, ngDialog,
                                    garsService, spinnerService, translationService, utilsService,
                                    gar, hash, data) {

        //VM  public stuff
        var vm = this;
        vm.gar = gar;
        vm.hash = hash;
        vm.data = data;
        vm.showActions = false;
        vm.isRectifying = false;
        
        //set date on datePicker child controller
        $scope.datepickerDate = new Date();

        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];

        vm.operationCodes = garsService.operationCodes();

        vm.lerCodes = garsService.lerCodes();    

        vm.submitted = false;

        vm.validateInput = function(name, type, formName) {
            var input = '';
            if(formName === 'formAnonymousAccept'){
                input = vm.formAnonymousAccept[name];
            }
            else if(formName === 'formAnonymousReject'){
                 input = vm.formAnonymousReject[name];
            }else if(formName === 'formAnonymousRectify'){
                input = vm.formAnonymousRectify[name];
            }else if(formName === 'formAnonymousConfirmRectify'){
                input = vm.formAnonymousConfirmRectify[name];
            }
            
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

        vm.submitFormAnonymousAccept = function() {
            vm.serverValidationErrors = [];
            vm.submitted = true;
            if (vm.formAnonymousAccept.$valid) {
                var data = {
                    day: $scope.datepickerDate.getDate(),              // yields date
                    month: $scope.datepickerDate.getMonth() + 1,       // yields month (add one as '.getMonth()' is zero indexed)
                    year: $scope.datepickerDate.getFullYear()  
                };
				data.ApaAccess = vm.apaAccess;

                garsService
					.anonymousAccept(vm.gar.UniqueId, vm.hash, data)
					.then(anonymousActionOnSuccess)
					.catch(anonymousActionOnError);
            }
        };

        vm.submitFormAnonymousReject = function() {
            vm.serverValidationErrors = [];
            vm.submitted = true;
            if (vm.formAnonymousReject.$valid) {
                var data = {
                    comment: vm.comment
                };
				data.ApaAccess = vm.apaAccess;

                garsService
					.anonymousReject(vm.gar.UniqueId, vm.hash , data)
					.then(anonymousActionOnSuccess)
					.catch(anonymousActionOnError);
            }
        };

        vm.submitFormAnonymousConfirmRectify = function(){
            vm.serverValidationErrors = [];
            vm.submitted = true;
            if (vm.formAnonymousConfirmRectify.$valid) {
                vm.data.ApaAccess = vm.apaAccess;
                garsService
                    .anonymousRectifyEGar(vm.gar.UniqueId, vm.hash, vm.data)
                    .then(anonymousActionOnSuccess)
                    .catch(anonymousActionOnError)
                    .finally(function(){
                        ngDialog.close();
                    });
            }
        }

        vm.getFile = function(url){
            $window.open(url, '_blank');
        }

		//CALLBACKS
        function anonymousActionOnSuccess(result){
            ngDialog.close();		
            utilsService.notifySuccess('Resposta enviada com sucesso!');
            $state.go('page.anonymousConsultGar', {hash:vm.hash});
        }

        function anonymousActionOnError(error){
            vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
			vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);
            var externalErrors = error.data._externalErrors;
            if(externalErrors){
                utilsService.parseAndNotifyExternalErrors(externalErrors);
                ngDialog.close();
            }
        }


        //SCOPE stuff
        $scope.$on('datepickerControllerChanged', function (evnt, data) {
            $scope.datepickerDate = data.scopeDate;
        });
    }
})();