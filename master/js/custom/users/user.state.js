(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(userState);

    userState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function userState($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        $stateProvider
            .state('app.user', {
                url: '/user',
                title: 'My User',
                templateUrl: '/app/custom/users/my.user.html',
                controller: 'userController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('ngDialog'),
            })
            .state('app.usersOverview', {
                url: '/users',
                title: 'Users Overview',
                templateUrl: '/app/custom/users/users.overview.html',
                controller: 'usersOverviewController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('datatables', 'ngDialog'),
            })
            .state('app.usersCreate', {
                url: '/users/create',
                title: 'Criar utilizador',
                templateUrl: '/app/custom/users/users.create.html',
                controller: 'userCreateController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('inputmask','localytics.directives', 'ngDialog', 'ui.select'),
            })
            .state('app.usersEdit', {
                url: '/users/edit/:id',
                title: 'Editar utilizador',
                templateUrl: '/app/custom/users/users.edit.html',
                controller: 'userEditController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('inputmask','localytics.directives', 'ngDialog', 'ui.select'),
            })
          ;
    }
})();