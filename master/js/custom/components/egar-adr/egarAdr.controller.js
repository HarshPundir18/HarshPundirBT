(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/egar-adr/egar-adr.html',
        controller: 'EgarAdrController',
        controllerAs: 'vm',
        transclude: true,
        bindings: {
            name: '@',
            adr:'=',
            errors:'=',
            onChange:'&'
        }
    };

    angular
        .module('custom')
        .component('smgEgarAdr', component);

    angular
        .module('custom')
        .controller('EgarAdrController', EgarAdrController);

    EgarAdrController.$inject = ['$element', '$filter', '$scope', 'spinnerService', 'pickupPointsService'];
    function EgarAdrController($element, $filter, $scope, spinnerService, pickupPointsService) {
        var vm = this;
         
        vm.validateInput = function(name, type) {
            var input = vm.egarAdr[name];
            var errorType = input.$error[type];
            var result = (input.$dirty || vm.submitted) && errorType;
            return result;    
        };

        vm.onIsAdrClick = function(){
            if(vm.onChange){
                vm.onChange({type: 'isAdr', obj: vm.isAdr});
            }
        }

        vm.onSelectedOnuNumberChange = function(obj){
            if(vm.onChange){
                vm.onChange({type: 'onuNumberChange', obj});
            }
        }

        vm.onSelectedOnuNumberPackageChange = function(obj){
            if(vm.onChange){
                vm.onChange({type: 'onuNumberPackageChange', obj});
            }
        }
    }
})();