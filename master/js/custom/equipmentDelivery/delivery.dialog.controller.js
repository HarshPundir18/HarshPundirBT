(function() {
    'use strict';

    angular
        .module('custom')
        .controller('deliveryDialogController', deliveryDialogController)

    deliveryDialogController.$inject = ['$rootScope', 'ngDialog', 'spinnerService', 'deliveryService'];
    function deliveryDialogController($rootScope, ngDialog, spinnerService, deliveryService) {
        var vm = this;
        // vm.equipments = equipments;
    }
})();