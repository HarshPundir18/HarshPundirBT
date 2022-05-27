(function() {
    'use strict';

    angular
        .module('custom')
        .controller('editEquipmentController', editEquipmentController);

    editEquipmentController.$inject = ['$state', '$rootScope', '$stateParams', '$filter', 
        'equipmentService', 'spinnerService', 'utilsService', 'Notify', 'ngDialog',
        'SMG_CONST_PICKUP_POINTS'];
    function editEquipmentController($state, $rootScope, $stateParams, $filter, 
        equipmentService, spinnerService, utilsService, Notify, ngDialog, 
        SMG_CONST_PICKUP_POINTS) {

        var vm = this;
        var loadGifSelector = '#editEquipment';

        spinnerService.show(loadGifSelector);

        vm.$onInit = function () {
        }

        vm.equipment = null;
        vm.submitted = false;
        vm.serverValidationErrors = [];

        if(!$stateParams.equipmentId){
            $state.go('app.equipments');
        }

        equipmentService
                .getSingleEquipment($stateParams.equipmentId)
                .then(getEquipmentOnSuccess)
                .catch(getEquipmentOnError)
                .finally(()=>{ spinnerService.hide(loadGifSelector) });

        vm.validateInput = function(name, type) {           
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
          };

               
        // Submit form
        vm.submitForm = function() {

            vm.submitted = true;
            if (vm.formValidate.$valid) {
                spinnerService.show(loadGifSelector);

                var data = {};
                data.Name = vm.name;
                data.ExternalId = vm.externalId;
                data.Detail = vm.detail;
                data.DeliveryId = vm.deliveryId;
                data.DeliveryLatitude = vm.deliveryLatitude;
                data.DeliveryLongitude = vm.deliveryLongitude;

                equipmentService
                    .update(vm.equipment.Id, data)
                    .then(updateEquipmentOnSuccess, updateEquipmentOnError)
                    .finally(() => { spinnerService.hide(loadGifSelector) });

            } else {
              console.log('Not valid!!');
              return false;
            }
        };
        
        vm.originSearchChangeV3 = function(){
            console.log('edit equipment originSearchChangeV3')
        }

        vm.cancel = function(){
            $state.go('app.equipments');
        }

        function getEquipmentOnSuccess(result){       
            vm.equipment = result.data.Items[0];
            vm.name = vm.equipment.Name;
            vm.externalId = vm.equipment.ExternalId;
            vm.detail = vm.equipment.Detail;
            vm.deliveryId = vm.equipment.DeliveryId;
            vm.deliveryLatitude = vm.equipment.DeliveryLatitude;
            vm.deliveryLongitude = vm.equipment.DeliveryLongitude;
        }

        
        function getEquipmentOnError(config, data, status, statusText){
            /* success (green), warning (orange), info (blue), error (red) */
            Notify.alert('<em class="fa fa-check"></em> Não foi possivel obter o equipamento cliente.', { status: 'warning'});
        }

        function updateEquipmentOnSuccess(result){
            $state.go('app.equipments');
            Notify.alert('<em class="fa fa-check"></em> Equipamento actualizado!', { status: 'success' });
        }

        function updateEquipmentOnError(error, status){
            vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            vm.serverValidationErrors = utilsService.parseErrors(error.data._applicationErrors);

            Notify.alert('<em class="fa fa-check"></em> Não foi possivel actualizar o equipamento cliente.', { status: 'danger' });
        }
    }
})();