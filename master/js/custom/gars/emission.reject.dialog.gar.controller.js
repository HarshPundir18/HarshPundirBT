(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garRejectEmissionDialogController', garRejectEmissionDialogController);

    garRejectEmissionDialogController.$inject = ['$window', '$rootScope', '$scope', 'ngDialog', 'utilsService', 'garsService', 'spinnerService', 'gar'];
    function garRejectEmissionDialogController($window, $rootScope, $scope, ngDialog, utilsService, garsService, spinnerService, gar) {

        const loadigGifSelector = '.ngdialog-message';
        
        var vm = this;     
        vm.gar = gar;

        vm.serverExternalErrors = [];

        //popup action
        vm.getFile = function(fileUrl){
            garsService
                .getEGarFile(fileUrl)
                .then(function (result){
                    $window.open('data:application/pdf;base64,' + result.data, '_blank');
                })
                .catch(function errorCallback(result){
                    alert('Não foi possivel obter o documento!')
                });
        }

        vm.validateInput = function(name, type) {
            var input = vm.formAcceptEmissionValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

        vm.submitted = false;
        // Submit form
        vm.submitFormAcceptEmission = function() {

            vm.serverValidationErrors = [];
            vm.submitted = true;
            if (vm.formAcceptEmissionValidate.$valid) {
                spinnerService.show(loadigGifSelector);

                var data = {
                    DestinComment: vm.comment
                };
                
                garsService
                    .rejectEmission(gar.UniqueId, data)
                    .then(rejectEmissionOnSuccess)
                    .catch(rejectEmissionOnError)
                    .finally(function() {
                        spinnerService.hide(loadigGifSelector);
                    });
            }
        };

        //datePicker event handling
        $scope.$on('datepickerControllerChanged', function (evnt, data) {
            $scope.datePickerDate = data.date;
        });


        //////////////////////////////////
        // CALLBACKS
        function rejectEmissionOnSuccess(result){
            ngDialog.close({
                action:'rejectEmissionOnSuccess'
            });
            utilsService.notifySuccess('E-Gar rejeitada com sucesso!')
            $rootScope.$broadcast('reloadTableEGars');
        }

        function rejectEmissionOnError(error){
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
                        vm.serverExternalErrors['EndDate'] = externalErrors[i].Message;
                    }
                }
            }
        }
    }
})();