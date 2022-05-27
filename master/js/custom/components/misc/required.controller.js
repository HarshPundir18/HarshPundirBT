(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/misc/required.html',
        controller: 'RequiredController',
        controllerAs: 'vm',
        bindings: {
            title: '@',
        }
    };

    angular
        .module('custom')
        .component('smgRequired', component);

    angular
        .module('custom')
        .controller('RequiredController', RequiredController);


    RequiredController.$inject = ['$rootScope', '$scope', 'dateService']
    function RequiredController($rootScope, $scope, dateService) {
        var vm = this;
        
        vm.hide = false;
    }
})();