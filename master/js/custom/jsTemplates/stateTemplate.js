// (function() {
//     'use strict';

//     angular
//         .module('app.routes')
//         .config(customState);

//     customState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
//     function customState($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
//         $stateProvider
//             .state('app.establishmentOverview', {
//                 url: '/establishments',
//                 title: 'Establishments Overview',
//                 templateUrl: '/app/custom/establishments/establishment.overview.html',
//                 controller: 'establishmentOverviewController',
//                 controllerAs: '$ctrl',
//                 resolve: helper.resolveFor('datatables', 'ngDialog')
//             })
//             .state('app.establishmentNew', {
//                 url: '/establishments/new',
//                 title: 'New Establishment',
//                 templateUrl: '/app/custom/establishments/establishment.html',
//                 controller: 'establishmentController',
//                 resolve: helper.resolveFor('taginput', 'inputmask','localytics.directives', 'ngDialog'),
//                 controllerAs: '$ctrl'
//             })
//           ;
//     }
// })();