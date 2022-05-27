(function() {
    'use strict';

    angular
        .module('custom')
        .controller('PickupPointsImportController', PickupPointsImportController);

    PickupPointsImportController.$inject = ['$scope', '$state', '$stateParams', 
        'translationService', 'spinnerService', 
        'pickupPointsService', 'utilsService', 'ngDialog', 'SMG_ESTABLISHMENT_TYPES'];
    function PickupPointsImportController($scope, $state, $stateParams, 
        translationService, spinnerService, 
        pickupPointsService, utilsService, ngDialog, SMG_ESTABLISHMENT_TYPES) {

        let vm = this;
        vm.loadingSelector = '#main';
        vm.pickupPoint = {};
        vm.SMG_ESTABLISHMENT_TYPES = SMG_ESTABLISHMENT_TYPES;

        vm.selectedEstablishmentName = 'selectedEstablishment';

        activate();

        vm.translate = (key) => { return translationService.translate(key); }

        vm.validateInput = function(name, type) {   
            if(name === vm.selectedEstablishmentName){
                var re = vm.submitted && vm.selectedAccountEstablishment == null;
                console.log(`${name} ${re}`);
                return re;
            }
            else{
                var input = vm.importPickupPointForm[name];
                var errorType = input.$error[type];
                return (input.$dirty || vm.submitted) && errorType;
            }
            
        };


        // Submit form
        vm.submitForm = function() {
            vm.submitted = true;
            if (vm.importPickupPointForm.$valid) {
                var data = {};
                data.vat = vm.selectedAccountEstablishment.vat;
                data.code = vm.code;

                spinnerService.show('.panel');
                pickupPointsService
                    .import(data)
                    .then(importPickupPointOnSuccess, importPickupPointOnError)
                    .finally(()=>{
                        spinnerService.hide('.panel');
                    });

            } else {
                console.log('Not valid!!');
                return false;
            }
        };

        function activate() {
            spinnerService.show(vm.loadingSelector);
        }

        function importPickupPointOnSuccess(result){
            $state.go('app.pickupPointsList');
            utilsService.notifySuccess('Ponto de recolha importado com sucesso.'); 
        }

        function importPickupPointOnError(error){
            if(error.data._applicationErrors && error.data._applicationErrors.length > 0){
                utilsService.parseAndNotifyApplicationErrors(error.data._externalErrors);
            } else if(error.data._externalErrors && error.data._externalErrors.length > 0){
                utilsService.parseAndNotifyExternalErrors(error.data._externalErrors);
            }
        }


        $scope.$on(`fetchEstablishmentFinished_${vm.selectedEstablishmentName}`, function(event, item){
            spinnerService.hide(vm.loadingSelector);
        });
        
    }
})();