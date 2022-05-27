(function(){
    'use strict';

    angular
        .module('custom')
        .service('settingsService', settingsService);

    settingsService.$inject = ['$http'];
    function settingsService ($http) {

        var baseUrl = '/api/settings';

        var _getClientSettings = function(){
            return $http.get(`${baseUrl}/client`);
        };

        var _saveClientSettings = (data) => {
            return $http.post(`${baseUrl}/client`, data)
        };


        var _getEgarSettings = function(){
            return $http.get(`${baseUrl}/egar`);
        };

        var _saveEgarSettings = function(eGarSettings) {
            return $http.post(`${baseUrl}/egar`, eGarSettings);
        };

        this.getClientSettings = _getClientSettings;
        this.saveClientSettings = _saveClientSettings;
        
        this.getEgarSettings = _getEgarSettings;
        this.saveEgarSettings = _saveEgarSettings;
    }
})();