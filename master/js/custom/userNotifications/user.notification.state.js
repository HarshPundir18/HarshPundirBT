(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(userNotificationState);

    userNotificationState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function userNotificationState($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        $stateProvider
            .state('app.userNotificationOverview', {
                url: '/user/notifications',
                title: 'User Notifications Overview',
                templateUrl: '/app/custom/userNotifications/user.notification.overview.html',
                controller: 'userNotificationOverviewController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })

            .state('app.userNotificaion', {
                url: '/user/notifications/:userNotificationId',
                title: 'Edit Establishment',
                templateUrl: '/app/custom/userNotifications/user.notification.html',
                resolve: helper.resolveFor('taginput', 'inputmask','localytics.directives', 'ngDialog'),
                controller: 'userNotificationController',
                controllerAs: '$ctrl'
            })
          ;
    }
})();