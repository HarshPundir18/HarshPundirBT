
(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(securityState);

    securityState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function securityState($stateProvider, $locationProvider, $urlRouterProvider, helper){

        $stateProvider
            .state('page.login', {
                url: '/login',
                title: 'Login',
                templateUrl: '/app/custom/security/login.html',
                controller: 'loginController',
                controllerAs: '$ctrl'
            })
            .state('page.register', {
                url: '/register',
                title: 'Register',
                templateUrl: '/app/custom/security/register.html',
                resolve: helper.resolveFor('recaptcha'),
                controller: 'registerController',
                controllerAs: '$ctrl'
            })
            .state('page.recover', {
                url: '/recover',
                title: 'Recuperação de Password',
                resolve: helper.resolveFor('recaptcha'),
                templateUrl: '/app/custom/security/recover.html',
                controller: 'recoverController',
                controllerAs: '$ctrl'
            })
            .state('page.recoverSetPassword', {
                url: '/recover-password/:token',
                title: 'Recuperação de Password',
                resolve: helper.resolveFor('recaptcha'),
                templateUrl: '/app/custom/security/recover-set-password.html',
                controller: 'recoverSetPasswordController',
                controllerAs: '$ctrl'
            })
          ;
    }
})();
