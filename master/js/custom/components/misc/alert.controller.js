(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/misc/alert.html',
        controller: 'AlertController',
        controllerAs: 'vm',
        bindings: {
            head: '@',
            content: '@',
            type: '<'
        }
    };

    angular
        .module('custom')
        .component('smgAlert', component);

    angular
        .module('custom')
        .controller('AlertController', AlertController);


    AlertController.$inject = ['$rootScope', '$scope', 'dateService', 'SMG_ALERT_TYPE']
    function AlertController($rootScope, $scope, dateService, SMG_ALERT_TYPE) {
        var vm = this;
        
        vm.hide = false;
        
        switch(vm.type){
            case SMG_ALERT_TYPE.INFO:
                vm.alertType = 'smg-message-info';
                break;
            case SMG_ALERT_TYPE.WARNING:
                vm.alertType = 'smg-message-warning';
                break;
            case SMG_ALERT_TYPE.ERROR:
                vm.alertType = 'smg-message-error';
                break;                
            default:
                vm.alertType = '';
        }
    }
})();
