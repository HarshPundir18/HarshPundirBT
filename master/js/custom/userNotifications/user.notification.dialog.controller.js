(function() {
    'use strict';

    angular
        .module('custom')
        .controller('userNotificationDialogController', userNotificationDialogController);

    userNotificationDialogController.$inject = ['$rootScope', '$state', '$scope', 'userNotification'];
    function userNotificationDialogController($rootScope, $state, $scope, userNotification) {

        var vm = this;
        vm.userNotification = userNotification;
        vm.userNotificationId = userNotification.UniqueId;
    }	
})();
