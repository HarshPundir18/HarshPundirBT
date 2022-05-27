(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garRectificationDialogController', garRectificationDialogController);

    garRectificationDialogController.$inject = ['$window', '$rootScope', '$scope', 'ngDialog', 'utilsService', 'garsService', 'spinnerService', 'gar', 'impressionate'];
    function garRectificationDialogController($window, $rootScope, $scope, ngDialog, utilsService, garsService, spinnerService, gar, impressionate) {

        const loadigGifSelector = '.ngdialog-message';

        var vm = this;     
        vm.gar = gar;
        vm.impressionate = impressionate;

        activate();

        vm.acceptRectification = function(){
            spinnerService.show(loadigGifSelector);

            var promise = null;

            if(vm.impressionate){
                promise = garsService.acceptRectificationImpressionate(vm.gar.UniqueId);
            }else{
                promise = garsService.acceptRectification(vm.gar.UniqueId);
            }

            promise.then(acceptRectificationOnSuccess)
                    .catch(acceptRectificationOnError)
                    .finally(function(){
						spinnerService.hide(loadigGifSelector);
					});

            return true;
        }

        //popup action
        vm.rejectRectification = function(){         
            if(vm.isRejecting == true && vm.rejectRectificationComment){
                var promise = null;
                var data = {
                        OriginComment: vm.rejectRectificationComment
                    };

                spinnerService.show(loadigGifSelector);

                if(vm.impressionate){
                    promise = garsService.rejectRectificationImpressionate(vm.gar.UniqueId, data);
                }else{
                    promise = garsService.rejectRectification(vm.gar.UniqueId, data);
                }

                promise
                    .then(rejectRectificationOnSuccess)
                    .catch(rejectRectificationOnError)
                    .finally(function(){
						spinnerService.hide(loadigGifSelector);
					});
                    
                return;
            }else if(vm.isRejecting == true && !vm.rejectRectificationComment){
                vm.isRejecting = false;
                return;
            }

            vm.isRejecting = true;
        }

        function activate(){
            garsService
                .getEGarRectification(gar.UniqueId)
                .then(getEGarRectificationOnSuccess)
                .catch(getEGarRectificationOnError);

        }


        //CALLBACKS
        function getEGarRectificationOnSuccess(result){
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

        function getEGarRectificationOnError(error){
            //TODO
        }

        function acceptRectificationOnSuccess(result){
            utilsService.notifySuccess('Correção Aceite com sucesso!')
            ngDialog.close({
                action: 'acceptRectificationOnSuccess'
            }); 
            $rootScope.$broadcast('reloadTableEGars');
        }

        function acceptRectificationOnError(error){
            if(error.status == 403){
                utilsService.notifyForbiden('Por favor verifique se tem accesso ao SILIAmb');
            }

            if(error.status == 400){
                vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
                vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);

                var externalErrors = error.data._externalErrors;
                if(externalErrors){
                    var notificationErrorMessage = '';
                    for (var i = 0; i < externalErrors.length; i++) { 
                        vm.serverExternalErrors['OriginComment'] = externalErrors[i].Message;
                    }
                }
            }
        }

        function rejectRectificationOnSuccess(result){
            utilsService.notifySuccess('Correção Rejeitada com sucesso!')
            ngDialog.close({
                action:'rejectRectificationOnSuccess'
            });
            $rootScope.$broadcast('reloadTableEGars');
        }

        function rejectRectificationOnError(error){
            if(error.status == 403){
                utilsService.notifyForbiden('Por favor verifique se tem accesso ao SILIAmb');
            }

            if(error.status == 400){
                vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
                vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);

                var externalErrors = error.data._externalErrors;
                if(externalErrors){
                    var notificationErrorMessage = '';
                    for (var i = 0; i < externalErrors.length; i++) { 
                        vm.serverExternalErrors['OriginComment'] = externalErrors[i].Message;
                    }
                }
            }
        }
    }
})();