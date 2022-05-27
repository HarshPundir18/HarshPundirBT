(function(){
    'use strict';

    angular
        .module('custom')
        .service('userNotificationService', userNotificationService);

    userNotificationService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function userNotificationService ($http, $q, $log, $state, $location, localStorageService) {

		var baseUrl = '/api/notifications';

		var _getUnreadUserNotificationCount = function(){
			return $http.get(baseUrl + '/unread/count');
		}

		var _getUserNotification = function(uniqueId){
			return $http.get(baseUrl + '/' + uniqueId);
		}

		var _getUserNotifications = function(start, length, searchTerm){
            var searchTermQueryParam = null;
            if(searchTerm && searchTerm.length > 2){
                searchTermQueryParam = '&searchTerm=' + searchTerm;
            }else{
                searchTermQueryParam = '';
            }

            return $http.get(window.appSettings.apiHost + '/api/notifications?start=' + start + '&pageSize=' + length + searchTermQueryParam);   
		}

        var _deleteUserNotification = function(uniqueId){
            return $http.delete(baseUrl + '/' + uniqueId);
        }

        var _markAsRead = function(uniqueId){
            return $http.put(baseUrl + '/markasread/' + uniqueId);
        }


		this.getUserNotification = _getUserNotification;
		this.getUserNotifications = _getUserNotifications;
		this.getUnreadUserNotificationCount = _getUnreadUserNotificationCount;
        this.deleteUserNotification = _deleteUserNotification;
        this.markAsRead = _markAsRead;
    }
})();
