(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(establishmentState);

    establishmentState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function establishmentState($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        $stateProvider
            .state('app.establishmentOverview', {
                url: '/establishments',
                title: 'Os meus Clientes',
                templateUrl: '/app/custom/establishments/establishment.overview.html',
                controller: 'establishmentsTableController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
            .state('app.establishmentNew', {
                url: '/establishments/new',
                title: 'Novo Estabelecimento',
                templateUrl: '/app/custom/establishments/establishment.html',
                controller: 'establishmentController',
                resolve: helper.resolveFor('taginput', 'inputmask','localytics.directives', 'ngDialog'),
                controllerAs: '$ctrl'
            })
            .state('app.establishmentEdit', {
                url: '/establishments/edit/:establishmentId',
                title: 'Editar Estabelecimento',
                templateUrl: '/app/custom/establishments/edit.establishment.html',
                resolve: helper.resolveFor('taginput', 'inputmask','localytics.directives', 'ngDialog', 'ui.select'),
                controller: 'editEstablishmentController',
                controllerAs: '$ctrl'
            })
            .state('app.myEstablishment', {
                url: '/establishments/my',
                title: 'Novo Estabelecimento',
                templateUrl: '/app/custom/establishments/establishment.my.html',
                controller: 'myEstablishmentController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('taginput', 'inputmask','localytics.directives')
            })
            .state('app.myEditEstablishment', {
                url: '/establishments/my/edit/:establishmentId',
                title: 'Editar Estabelecimento',
                templateUrl: '/app/custom/establishments/my.edit.establishment.html',
                controller: 'myEditEstablishmentController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('taginput', 'inputmask','localytics.directives','ngDialog')
            })
            .state('app.myNewEstablishment', {
                url: '/my-establishments/new',
                title: 'Novo Estabelecimento',
                templateUrl: '/app/custom/establishments/establishment.my.new.html',
                controller: 'myNewEstablishmentController',
                resolve: helper.resolveFor('taginput', 'inputmask','localytics.directives', 'ngDialog'),
                controllerAs: '$ctrl'
            })
            .state('app.myEstablishmentsOverview', {
                url: '/my-establishments',
                title: 'Os meus Estabelecimentos',
                templateUrl: '/app/custom/establishments/my.establishments.overview.html',
                controller: 'myEstablishmentsOverviewController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
          ;
    }
})();