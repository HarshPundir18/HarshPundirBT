(function() {
    'use strict';

    angular
        .module('custom')
        .controller('userNotificationController', userNotificationController);

    userNotificationController.$inject = ['$rootScope', '$state', 'translationService', 'userNotificationService', 'oauthService'];
    function userNotificationController($rootScope, $state, translationService, userNotificationService, oauthService) {
        
        //VM stuff
        var vm = this;
        vm.loggedUserEmail = oauthService.loggedUserEmail();
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        vm.unreadNotifications = 0;
        vm.hasUnreadNotifications = false;
        vm.lblNotifications = translationService.translate('lbl-notifications');
        vm.lblNewNotifications = '';
        
        vm.toggleUserBlock = function(){
            $state.go('app.user');
        }

        //
        activate();

        //CALLBACKS

        //PRIVATES
        function activate(){
            userNotificationService
                .getUnreadUserNotificationCount()
                .then(function(result){
                    vm.unreadNotifications = result.data.Count;
                    if(vm.unreadNotifications > 0){
                        vm.lblNewNotifications = vm.unreadNotifications == 1 ?
                                        vm.unreadNotifications + " " + translationService.translate('lbl-newNotification')
                                        : vm.unreadNotifications + " " + translationService.translate("lbl-newNotifications")
                    }else{
                        vm.lblNewNotifications = "Notificações"
                    }

                    $rootScope.$broadcast('newNotificationEvent', result.data.Count);
                });
        }

        //SCOPE stuff
    }
})();