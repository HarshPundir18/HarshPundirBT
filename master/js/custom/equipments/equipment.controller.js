(function() {
    'use strict';

    angular
        .module('custom')
        .controller('equipmentController', equipmentController);

    equipmentController.$inject = ['$state', '$scope', '$q', '$stateParams',
                                        'equipmentService', 'spinnerService',  'utilsService',
                                        'Notify', 'ngDialog'];
    function equipmentController($state, $scope, $q, $stateParams,
                                        equipmentService, spinnerService, utilsService,
                                        Notify, ngDialog) {
        
        var vm = this;
        vm.accessInvalidMsg = null;
        vm.accessInvalid = true;
    
        vm.serverValidationErrors = [];

        vm.validateInput = function(name, type) {
            
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
                
                data.Name = vm.name;
                data.ExternalId = vm.externalId;
                data.Detail = vm.detail;
                data.DeliveryId = '';
                data.DeliveryLatitude = null;
                data.DeliveryLongitude = null;

                spinnerService.show('.panel-body');
                equipmentService
                    .createEquipment(data)
                    .then(createEquipmentOnSuccess, createEquipmentOnError)
                    .finally(spinnerService.hide('.panel-body'));

            } else {
              console.log('Not valid!!');
              return false;
            }
        };
        
        vm.cancel = function(){
            $state.go('app.equipments');
        }
    
        function createEquipmentOnSuccess(result){
            $state.go('app.equipments');
            Notify.alert('<em class="fa fa-check"></em> Equipamento criado!', { status: 'success'});
        }

        function createEquipmentOnError(error, status){
            vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);

            if(
                (error.data._validationErrors && error.data._validationErrors.length > 0) || 
                (error.data._applicationErrors && error.data._applicationErrors.length > 0)
            ){
                Notify.alert( 
                    '<em class="fa fa-times"></em> Existem erros de validação, por favor confira o formulário.', 
                    { status: 'warning'}
                );
            }

            var notificationErrorMessage = '';
            var externalErrors = error.data._externalErrors;
            if(externalErrors){
                utilsService.parseAndNotifyExternalErrors(externalErrors);
                ngDialog.close();
            }
        } 
    }
})();
