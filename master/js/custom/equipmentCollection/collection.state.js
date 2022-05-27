(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(collectionState);

    collectionState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function collectionState($stateProvider, $locationProvider, $urlRouterProvider, helper){

        $stateProvider
                .state('app.newEquipmentCollection', {
                    url: '/collection',
                    title: 'Criar Equipamentos Coleção',
                    templateUrl: '/app/custom/equipmentCollection/create.equipment.collection.html',
                    controller: 'collectionController',
                    resolve: helper.resolveFor('taginput', 'inputmask','localytics.directives',
                    'ngDialog', 'ui.select'),
                    controllerAs: '$ctrl'
                })
                ;
    }
})();