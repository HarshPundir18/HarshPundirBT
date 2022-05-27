(function () {
    'use strict';

    angular
        .module('custom')
        .service('securityService', securityService);

    securityService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function securityService($http, $q, $log, $state, $location, localStorageService) {

        var _register = function (data) {
            $log.info(data);
            return $http.post('api/account/register', data)
        };

        var _recover = function(data){
            return $http.post('api/account/recover', data)
        }

        var _recoverSetPassword = function(data){
            return $http.post('api/account/recover-set-password', data)
        }

        var _checkGdpr = function(){
            return $http.get('api/account/check-gdpr');
        };

        var _acceptGdpr = function(){
            return $http.post('api/account/accept-gdpr');
        };

        this.register = _register;
        this.recover = _recover;
        this.recoverSetPassword = _recoverSetPassword;
        this.checkGdpr = _checkGdpr;
        this.acceptGdpr = _acceptGdpr;
    }
})();
