(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(supportState);

    supportState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function supportState($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        $stateProvider
            .state('app.support', {
                url: '/support',
                title: 'Suporte',
                templateUrl: '/app/custom/support/support.html',
                controller: 'supportController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
            .state('page.contactRequest', {
                url: '/contact',
                title: 'Suporte',
                templateUrl: '/app/custom/support/contact.request.html',
                controller: 'supportController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
          ;
    }
})();