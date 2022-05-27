(function () {
    'use strict';

    angular
        .module('custom')
        .config(dashboardState);

    dashboardState.$inject = ['$stateProvider', '$locationProvider', 
        '$urlRouterProvider', 'RouteHelpersProvider'];
    function dashboardState($stateProvider, $locationProvider,
        $urlRouterProvider, helper) {

        $stateProvider
            //   .state('app.dashboard', {
            //       url: '/dashboard',
            //       title: 'Dashboard',
            //       //templateUrl: helper.basepath('dashboard.html'),
            //       templateUrl: '/app/custom/dashboard/dashboard.html',
            //       controller: 'dashboardController as $ctrl',
            //       resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'weather-icons')
            //   })
            .state('app.dashboard', {
                url: '/dashboard',
                title: 'Dashboard',
                //templateUrl: helper.basepath('dashboard.html'),
                templateUrl: '/app/custom/dashboard/home.html',
                controller: 'homeController as $ctrl',
                resolve: helper.resolveFor('ngDialog')
                //resolve: helper.resolveFor('chartjs')
                //resolve: helper.resolveFor('nvd3')
            })
            .state('app.Mycalendar', {
                url: '/mycalendar',
                title: 'Calendar',
                templateUrl: '/app/custom/dashboard/my.calendar.html',
                controller: 'MyCalendarController as vm',
                resolve: helper.resolveFor('moment', 'ui.calendar')
            })
            ;
    }
})();


