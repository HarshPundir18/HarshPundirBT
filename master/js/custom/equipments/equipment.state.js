(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(equipmentState);

    equipmentState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function equipmentState($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        $stateProvider
            .state('app.equipments', {
                url: '/equipments',
                title: 'Os meus Equipamento',
                templateUrl: '/app/custom/equipments/list.equipment.html',
                controller: 'equipmentsTableController as vm',
                // controllerAs: '$ctrl',
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
            .state('app.equipmentNew', {
                url: '/equipments/new',
                title: 'Novo Equipamento',
                templateUrl: '/app/custom/equipments/add.equipment.html',
                controller: 'equipmentController',
                resolve: helper.resolveFor('taginput', 'inputmask','localytics.directives', 'ngDialog'),
                controllerAs: '$ctrl'
            })
            .state('app.editEquipment', {
                url: '/equipments/edit/:equipmentId',
                title: 'Editar Equipamento',
                templateUrl: '/app/custom/equipments/edit.equipment.html',
                controller: 'editEquipmentController',
                resolve: helper.resolveFor('taginput', 'inputmask','localytics.directives', 'ngDialog', 'ui.select'),
                controllerAs: '$ctrl'
            })
          ;
    }
})();