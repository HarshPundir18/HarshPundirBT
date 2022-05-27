(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-client/select-client.html',
        controller: 'SelectClientController',
        bindings: {
            optionsSource: '=',
            selectedOption: '=',
            labelText: '@',
            onChange: '&',
            clear: '&'
        },

    };

    angular
        .module('custom')
        .component('smgSelectClient', component);

    angular
        .module('custom')
        .controller('SelectClientController', SelectClientController);

    function SelectClientController($scope, garsService) {

        var vm = this;
        vm.options = vm.optionsSource;
        
        vm.onSelectionChange = function(){
            vm.onChange({selected: vm.selectedOption});
        }
    }
})();