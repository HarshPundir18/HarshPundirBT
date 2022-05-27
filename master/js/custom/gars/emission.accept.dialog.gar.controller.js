(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garAcceptEmissionDialogController', garAcceptEmissionDialogController);

    garAcceptEmissionDialogController.$inject = ['$window', '$rootScope', '$scope', 'ngDialog', 
        'dateService', 'translationService', 'utilsService',
        'garsService', 'spinnerService', 'gar'];
    function garAcceptEmissionDialogController($window, $rootScope, $scope, ngDialog, 
        dateService, translationService, utilsService,
        garsService, spinnerService, gar) {

        const loadigGifSelector = '.ngdialog-message';

        var vm = this;     
        vm.gar = gar;

        vm.date = new Date();
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
            vm.dateErrorMessage = null;
            vm.timeErrorMessage = null;
            vm.serverValidationErrors = [];
            vm.submitted = true;

            var closeDate = vm.date;
            var closeTime = vm.time;

            // if (vm.formAcceptEmissionValidate.$valid) {
            if (isValidForm()) {
                spinnerService.show(loadigGifSelector);

                var data = {
                    day: closeDate.getDate(),              // yields date
                    month: closeDate.getMonth() + 1,       // yields month (add one as '.getMonth()' is zero indexed)
                    year: closeDate.getFullYear(),         // yields year
                    hour: closeTime.getHours(),
                    minute: closeTime.getMinutes()
                };
                
                garsService
                    .acceptEmission(gar.UniqueId, data)
                    .then(acceptEmissionOnSuccess)
                    .catch(acceptEmissionOnError)
                    .finally(function() {
                        spinnerService.hide(loadigGifSelector)
                    });
            }
        };

        //datePicker event handling
        $scope.$on('datepickerControllerChanged', function (evnt, data) {
            $scope.datePickerDate = data.date;
        });

        //////////////////////////////////
        // CALLBACKS

        function acceptEmissionOnSuccess(result){
            ngDialog.close({
                action: 'acceptEmissionOnSuccess'
            });
            utilsService.notifySuccess('E-Gar Aceite com sucesso!')
            $rootScope.$broadcast('reloadTableEGars');
        }

        function acceptEmissionOnError(error){
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
        
        function isValidForm(){
            var validDate = true;
            var validTime = true;

            if(!dateService.isValidDate(vm.date)){
                vm.dateErrorMessage = translationService.translate('ui_val_must_select_date');
                validDate = false;
            }

            if(!dateService.isValidDate(vm.time)){
                vm.timeErrorMessage = translationService.translate('ui_val_must_select_time');
                validTime = false;
            }

            return validDate && validTime;
        }
    }
})();