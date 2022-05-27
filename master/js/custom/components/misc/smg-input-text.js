
   


   (function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/misc/smg-input-text.html',
        controller: 'SmgInputTextController',
        controllerAs: 'vm',
        bindings: {
            name:'<',
            labelText: '@',
            hideLabelText: '<',
            placeholder: '<',
            model: '=',
            isRequired: '<',
            showClearInput: '<'
        }
    };

    angular
        .module('custom')
        .component('smgInputText', component);

    angular
        .module('custom')
        .controller('SmgInputTextController', SmgInputTextController);

        SmgInputTextController.$inject = ['$element', '$scope'];
    function SmgInputTextController($element, $scope) {
        var vm = this;
  
        vm.onClearTextClick = ()=>{
            vm.model=null;
            console.log('basd');
        }
        
        var setEventName = `set${vm.name}`;
        $scope.$on(setEventName, function(event, item){
            console.log(setEventName);
        });

        var clearEventName = `clear${vm.name}`;
        $scope.$on(clearEventName, function(event, item){
            console.log(clearEventName);
        });
    }
})();