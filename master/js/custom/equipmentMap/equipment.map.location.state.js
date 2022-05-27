(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(equipmentMapLocationState);

    equipmentMapLocationState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function equipmentMapLocationState($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        $stateProvider
            .state('app.equipmentMapLocation', {
                url: '/equipment/location',
                title: 'Equipamentos',
                templateUrl: '/app/custom/equipmentMap/equipment.map.location.html',
                controller: 'equipmentMapLocationController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
          ;
    }
})();