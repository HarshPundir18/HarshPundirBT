(function() {
    'use strict';

    angular
        .module('custom')
        .controller('PickupPointsEditController', PickupPointsEditController);

    PickupPointsEditController.$inject = ['$scope', '$state', '$stateParams', 'translationService', 'spinnerService', 'pickupPointsService', 'utilsService', 'ngDialog'];
    function PickupPointsEditController($scope, $state, $stateParams, translationService, spinnerService, pickupPointsService, utilsService, ngDialog, id) {
        let vm = this;
        vm.pickupPoint = {};

        if(!$stateParams.id){
            $state.go('app.pickupPointsList');
        }
        activate();

        vm.validateInput = function(name, type) {          
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

        vm.cancel = function(){
            $state.go('app.pickupPointsList');
        }

        // Submit form
        vm.submitForm = function() {
            vm.submitted = true;
            if (vm.formValidate.$valid) {
                var data = {};
                
                data.PickupPointVat = vm.pickupPoint.PickupPointVat;
                data.PrimaryCae = vm.pickupPoint.Cae1;
                data.SecondaryCae = vm.pickupPoint.Cae2;
                
                data.Phone = vm.pickupPoint.Phone;
                data.Fax = vm.pickupPoint.Fax;
                data.Mobile = vm.pickupPoint.Mobile;
                data.Email = vm.pickupPoint.Email;
                
                spinnerService.show('.panel-body');
                pickupPointsService
                    .updatePickupPoint(vm.pickupPoint.UniqueId, data)
                    .then(updatePickupPointOnSuccess, updatePickupPointOnError)
                    .finally(spinnerService.hide('.panel-body'));

            } else {
              console.log('Not valid!!');
              return false;
            }
        };

        function activate() {
            pickupPointsService
                .getPickupPoint($stateParams.id)
                .then(getPickupPointOnSuccess)
                .catch(getPickupPointOnError);
        }

        function updatePickupPointOnSuccess(result){
            $state.go('app.pickupPointsList');
            utilsService.notifySuccess('Ponto de recolha actualizado com sucesso.'); 
        }

        function updatePickupPointOnError(error){
            utilsService.notifyError('Não foi possível actualizar o Ponto de recolha. <br> Se esta situação persistir por favor contacte o suporte.'); 
        }

        function getPickupPointOnSuccess(result){
            vm.pickupPoint = result.data;
        }

        function getPickupPointOnError(error){
            utilsService.notifyError('Não foi possível obter o Ponto de recolha. <br> Se esta situação persistir por favor contacte o suporte.'); 
        }
    }
})();