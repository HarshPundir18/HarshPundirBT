(function(){
    'use strict';

    angular
        .module('app.dashboard')
        .service('oauthService', oauthService);

    oauthService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function oauthService ($http, $q, $log, $state, $location, localStorageService) {

        var AUTHORIZATION_DATA_KEY = 'authorizationData';

		this.sayHello = function(){
			$log.info('sayhello');
            return $http.get('api/dummy/get');
		}

        var _logOut = function () {
             localStorageService.remove(AUTHORIZATION_DATA_KEY);
             $state.go('page.login');
        };


        var _login = function(loginData) {
            localStorageService.remove(AUTHORIZATION_DATA_KEY);
            var data = "grant_type=password&username=" + loginData.username + "&password=" + loginData.password + "&clientCode=" + loginData.clientCode + "&client_id=" + appSettings.clientId;

            var req = {
                 method: 'POST',
                 url: '/token',
                 headers: {
                   'Content-Type': 'application/x-www-form-urlencoded'
                 },
                 data: data
            };

            return $http(req)
        }

        var _getExpirationDate = function(totalSeconds){
            var date = new Date();
            date.setSeconds(date.getSeconds() + totalSeconds);
            return date;
        }

        var _setDefaultEstablishment = function(defaultEstablishmentId){
            var  item = localStorageService.get(AUTHORIZATION_DATA_KEY);
            item.defaultEstablishment = defaultEstablishmentId;
            localStorageService.set(AUTHORIZATION_DATA_KEY, item);
        }

        var _setLocalStorageData = function (data){
            localStorageService.set(AUTHORIZATION_DATA_KEY, 
                                            { 
                                                token: data.access_token, 
                                                username: data.username,
                                                defaultEstablishment: data.defaultEstablishment,
                                                clientCode: data.clientCode,
                                                refreshToken: data.refresh_token,
                                                shouldConfigure: data.shouldConfigure
                                            });
                
        }

        var _hasDefaultEstablishment = function(){
            var a = localStorageService.get(AUTHORIZATION_DATA_KEY);
            if(a && a.shouldConfigure == 'False'){
                return true;
            }else{
                return false;
            }
        }

        var _refreshToken = function () {
            var deferred = $q.defer();
            var authData = localStorageService.get(AUTHORIZATION_DATA_KEY);
            if (authData && authData.refreshToken) {
                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&username="+ authData.username + "&clientCode=" + authData.clientCode  + "&client_id=" + appSettings.clientId;
                localStorageService.remove(AUTHORIZATION_DATA_KEY);

                $http.post(appSettings.serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                    .success(function (response) {
                        _setLocalStorageData(response);

                        deferred.resolve(response);

                    }).error(function (err, status) {
                        _logOut();
                        deferred.reject(err);
                });
            } else {
                deferred.reject();
            }

            return deferred.promise;
        };

         var _refreshToken2 = function () {
            var authData = localStorageService.get(AUTHORIZATION_DATA_KEY);
            if(authData){
                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&username="+ authData.username + "&clientCode=" + authData.clientCode  + "&client_id=" + appSettings.clientId;
                localStorageService.remove(AUTHORIZATION_DATA_KEY);
                return $http.post(appSettings.serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            }else {
                var deferred = $q.defer();
                deferred.reject();
                return deferred.promise;
            }           
        };

        var _getAuthorizationHeader = function(){
            var authHeader = '';
            var authData = localStorageService.get(AUTHORIZATION_DATA_KEY);
            if (authData) {
                authHeader = 'Bearer ' + authData.token;    
            }
            return authHeader;
        }

        var _loggedUserEmail = function(){
            var a = localStorageService.get(AUTHORIZATION_DATA_KEY);
            if(a){
                return a.username;
            }else{
                _logOut();

                return "Anónimo";
            }
        }

        this.getExpirationDate = _getExpirationDate;
        this.logOut = _logOut;
        this.login = _login;
        this.refreshToken = _refreshToken;
        this.refreshToken2 = _refreshToken2;
        this.getAuthorizationHeader = _getAuthorizationHeader;
        this.setLocalStorageData = _setLocalStorageData;
        this.hasDefaultEstablishment = _hasDefaultEstablishment;
        this.setDefaultEstablishment = _setDefaultEstablishment;
        this.loggedUserEmail = _loggedUserEmail;
    }
})();
