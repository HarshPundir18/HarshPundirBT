(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(warehouseState);

    warehouseState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function warehouseState($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        $stateProvider
            .state('app.warehouseOverview', {
                url: '/warehouse',
                title: 'Establishments Overview',
                templateUrl: '/app/custom/warehouse/warehouse.overview.html',
                controller: 'warehouseOverviewController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('nvd3')
            })
          ;
    }
})();