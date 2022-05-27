(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(pickupPointsState);

    pickupPointsState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function pickupPointsState($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        $stateProvider
            .state('app.pickupPoints',
            {
                url: '/pickupPoints',
                abstract: true,
                //template: '<ui-view></ui-view>',
                //templateUrl: helper.basepath('app.html'),
            })
            .state('app.pickupPointsList', {
                url: '/list',
                controller: 'PickupPointsListController as vm',
                //controllerAs: '$ctrl',
                //template: require('./pages/reports-list.html'),
                title: 'Pontos de recolha (OUA, ExSitu e Equipamentos))',
                templateUrl: '/app/custom/pickupPoints/pickupPoints.list.html',
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
            .state('app.pickupPointsEdit', {
                url: '/edit/:id',
                controller: 'PickupPointsEditController as $ctrl',
                title: 'Ponto de recolha',
                templateUrl: '/app/custom/pickupPoints/pickupPoints.edit.html',
                resolve: helper.resolveFor('ngDialog')
            })
            .state('app.pickupPointsImport', {
                url: '/import',
                controller: 'PickupPointsImportController as vm',
                title: 'Importat ponto de recolha',
                templateUrl: '/app/custom/pickupPoints/pickupPoints.import.html',
                resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ngDialog', 'ui.select')
            })
          ;
    }
})();

