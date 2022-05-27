(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(deliveryState);

    deliveryState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function deliveryState($stateProvider, $locationProvider, $urlRouterProvider, helper){

        $stateProvider
                .state('app.newEquipmentDelivery', {
                    url: '/delivery/create',
                    title: 'Criar entrega de equipamentos',
                    templateUrl: '/app/custom/equipmentDelivery/create.delivery.html',
                    controller: 'deliveryController',
                    resolve: helper.resolveFor('taginput', 'inputmask','localytics.directives', 
                    'ui.bootstrap-slider', 'ngWig',
                    'filestyle', 'ngDialog', 'ui.select'),
                    controllerAs: '$ctrl'
                })
                ;
    }
})();