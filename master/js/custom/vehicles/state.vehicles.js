(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(vehiclesState);

    vehiclesState.$inject = ['$stateProvider', 'RouteHelpersProvider'];
    function vehiclesState($stateProvider, helper){
        
        $stateProvider
            .state('app.vehiclesOverview', {
                url: '/vehicles',
                title: 'Vehicles Overview',
                templateUrl: '/app/custom/vehicles/vehicle.overview.html',
                controller: 'VehiclesListController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'ngDialog', 'ui.select')
            })
            .state('app.vehicleCreate', {
                url: '/vehicles/create',
                title: 'Criar veículo',
                templateUrl: '/app/custom/vehicles/vehicle.createOrUpdate.html',
                controller: 'VehicleCreateOrUpdateController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('inputmask','localytics.directives', 'ngDialog'),
            })
            .state('app.vehiclesEdit', {
                url: '/vehicle/edit/:id',
                title: 'Editar veículo',
                templateUrl: '/app/custom/vehicles/vehicle.createOrUpdate.html',
                controller: 'VehicleCreateOrUpdateController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('inputmask','localytics.directives', 'ngDialog','datatables'),
            })
          ;
    }
})();