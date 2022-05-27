(function() {
    'use strict';

    angular
        .module('custom')
        .controller('anonymousRectificationAcceptancePopupController', anonymousRectificationAcceptancePopupController);

    anonymousRectificationAcceptancePopupController.$inject = ['$window', '$rootScope', '$state',
                                    'garsService', 'utilsService', 'ngDialog', 'gar', 'hash'];
    function anonymousRectificationAcceptancePopupController($window, $rootScope, $state,
                                    garsService, utilsService, ngDialog, gar, hash) {
        
        //VM stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
		vm.gar = gar;
		vm.hash = hash;
        var requestInFlight = null;

		vm.getFile = function(url){
            $window.open(url, '_blank');
        }

		vm.validateInput = function(name, type, formName) {
            var input = '';
            if(formName === 'formAnonymousAcceptRectification'){
                input = vm.formAnonymousAcceptRectification[name];
            }
            else if(formName === 'formAnonymousRejectRectification'){
                 input = vm.formAnonymousRejectRectification[name];
            }
            
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

        vm.submitted = false;

        vm.submitFormAnonymousAcceptRectification = function() {
            vm.serverValidationErrors = [];
            vm.submitted = true;
            if (vm.formAnonymousAcceptRectification.$valid) {
                var data = {
                    ApaAccess: vm.apaAccess
                };

                if(requestInFlight){
                    console.log('requestInFlight...');
                    return;
                }

                requestInFlight = garsService
                                    .anonymousAcceptRectification(vm.gar.UniqueId, hash, data)
                                    .then(anonymousAcceptOrRejectRectificationOnSuccess)
                                    .catch(anonymousAcceptOrRejectRectificationOnError)
                                    .finally(function(){
                                        requestInFlight = null;
                                    });
            }
        };

        vm.submitFormAnonymousRejectRectification = function() {
            vm.serverValidationErrors = [];
            vm.submitted = true;
            if (vm.formAnonymousRejectRectification.$valid) {
                var data = {
                    Comment: vm.rejectRectificationComment,
                    ApaAccess: vm.apaAccess
                };

                garsService
					.anonymousRejectRectification(vm.gar.UniqueId, hash, data)
					.then(anonymousAcceptOrRejectRectificationOnSuccess)
					.catch(anonymousAcceptOrRejectRectificationOnError);
            }
        };


        //
        activate();

        //CALLBACKS
        function getGarRectificationOnSuccess(result){
            console.log(result.data)
			vm.destinComment = result.data.DestinComment;
            vm.groupCode = result.data.GroupCode;
            vm.lerCode = result.data.LerCode;
            vm.newGroupCode = result.data.NewGroupCode;
            vm.newLerCode = result.data.NewLerCode;
            vm.newOperationCode = result.data.NewOperationCode;
            vm.newPglNumber = result.data.NewPglNumber;
            vm.newQuantity = result.data.NewQuantity;
            vm.operationCode = result.data.OperationCode;
            vm.originComment = result.data.OriginComment;
            vm.pglNumber = result.data.PglNumber;
            vm.quantity = result.data.Quantity;
            vm.closeDate = result.data.FormatedCloseDate;
        }

        function getGarRectificationOnError(error){
            //todo
        }

		
        function anonymousAcceptOrRejectRectificationOnSuccess(result){
            utilsService.notifySuccess('Resposta enviada com sucesso!');
            $state.go('page.authorizeGarEmission', {hash:vm.hash});
            ngDialog.close();
        }

        function anonymousAcceptOrRejectRectificationOnError(error){
            vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
			vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);

            var externalErrors = error.data._externalErrors;
            if(externalErrors){
                utilsService.parseAndNotifyExternalErrors(externalErrors);
                ngDialog.close();
            }

            
        }

        //PRIVATES
        function activate(){
			garsService.anonymousGetGarRectification(hash)
                .then(getGarRectificationOnSuccess)
                .catch(getGarRectificationOnError);
        }

		//SCOPE stuff
    }
})();