(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(serviceAreaState);

    serviceAreaState.$inject = ['$stateProvider', 'RouteHelpersProvider'];
    function serviceAreaState($stateProvider, helper){
        
        $stateProvider
            .state('app.serviceArea', {
                url: '/service-areas/:id',
                title: 'Áreas de Serviço',
                templateUrl: '/app/custom/service-areas/service-area.html',
                controller: 'ServiceAreaController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ngDialog', 'ui.select')
            })
            .state('app.serviceAreasOverview', {
                url: '/service-areas',
                title: 'Lista Áreas de Serviço',
                templateUrl: '/app/custom/service-areas/service-areas-overview.html',
                controller: 'OverviewServiceAreasController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'ngDialog', 'ui.select'),
            })
          ;
    }
})();