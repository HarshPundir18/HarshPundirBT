
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('VehicleDeleteController', VehicleDeleteController);

        VehicleDeleteController.$inject = ['$state', '$stateParams', 
                                    'spinnerService', 'vehiclesService', 'utilsService', 'ngDialog', 'vehicle'];
    function VehicleDeleteController($state, $stateParams,
                                    spinnerService, vehiclesService, utilsService, ngDialog, vehicle) {
        let vm = this;
        
        vm.data = {};
        vm.dtInstance = {};
        vm.pageSize = 10;

        vm.title =  'Remover Veículo';



    }
})();

