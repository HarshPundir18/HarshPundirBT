(function(){
    'use strict';

    angular
        .module('custom')
        .service('userService', userService);

    userService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function userService ($http, $q, $log, $state, $location, localStorageService) {

		var baseUrl = '/api/users';

		var _changePassword = function(data){
			return $http.post('/api/account/change-password', data);
        }
        
        var _getUsers = function(dataTable){
            var url = _buildFetchUrl(dataTable);
            return $http.get(url);
        }

        var _getAllClientUsers = function(){
            return $http.get(baseUrl + '/all');
        }

        var _buildFetchUrl = function(dataTable) {
            var searchTerm = null;
            if (dataTable.search && dataTable.search.value && dataTable.search.value.length > 2) {
                searchTerm = '&searchTerm=' + dataTable.search.value;
            } else {
                searchTerm = '';
            }

            var fetchUrl = window.appSettings.apiHost + '/api/users?start=' + dataTable.start + '&pageSize=' + dataTable.length + searchTerm;

            return fetchUrl;
        }

        var _create = function(data){
            return $http.post('/api/users', data);
        } 

        var _update = function(id, data){
            return $http.put(`${baseUrl}/${id}`, data);
        }

        var _delete = function(userId){
            return $http.delete('/api/users/' + userId);
        }

        var _checkCanCreateAccountEstablishments = function(){
            return $http.get('/api/users/isSuperAdmin');
        }

        var _removeUserFromSystem = function(){
            return $http.post('/api/users/remove-self');
        }

        var _getSelectUsers = function(offset, limit, search){
            var url = `${baseUrl}?start=${offset}&pageSize=${limit}`;
            if(search && search.length > 0){
                url = `${url}&searchTerm=${search}`;
            }
            return $http.get(url);
        };

        var _getSelectUsersV2 = function(offset, limit, search){
            var url = `${baseUrl}/select-users?start=${offset}&pageSize=${limit}`;
            if(search && search.length > 0){
                url = `${url}&searchTerm=${search}`;
            }
            return $http.get(url);
        };

        var _getUser = function(id){
            var url = `${baseUrl}/${id}`;
            return $http.get(url);
        };
        
        var _getRoles = function(){
            return $http.get(`${baseUrl}/roles`);
        }

        this.getRoles = _getRoles;
        this.getUser = _getUser;
        this.getSelectUsers =_getSelectUsers;
        this.getSelectUsersV2 = _getSelectUsersV2;
        this.changePassword = _changePassword;
        this.getUsers = _getUsers;
        this.create = _create;
        this.update = _update;
        this.delete = _delete;
        this.getAllClientUsers = _getAllClientUsers;
        this.checkCanCreateAccountEstablishments = _checkCanCreateAccountEstablishments;
        this.removeUserFromSystem = _removeUserFromSystem;
    }
})();
