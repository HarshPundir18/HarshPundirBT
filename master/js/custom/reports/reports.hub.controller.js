
(function () {
    'use strict';

    angular
        .module('custom')
        .controller('ReportsHubController', ReportsHubController);

    ReportsHubController.$inject = ['$q', '$state',
        'spinnerService', 'pickupPointsService',
        'garsService', 'utilsService', 'browserService', 'dateService', 
        'SMG_ESTABLISHMENT_TYPES', 'SMG_CONST_PICKUP_POINTS', 'SMG_EGAR_TYPES'];
    function ReportsHubController($q, $state,
        spinnerService, pickupPointsService,
        garsService, utilsService, browserService, dateService, 
        SMG_ESTABLISHMENT_TYPES, SMG_CONST_PICKUP_POINTS, SMG_EGAR_TYPES) {

        //VM stuff
        var vm = this;
     
        vm.message = 'Greeting from ReportsHubController';


        vm.goToGenericReport = ()=>{
            $state.go('app.genericReports', { previousState: $state.current.name });
        }

        vm.goToGeneralReceivedQuantitiesSummaryReport = ()=>{ 
            $state.go('app.receivedQuantitiesSummaryReport', { egarType: SMG_EGAR_TYPES.PRODUTOR_ESTABELECIMENTO  });
        }

    }
})();