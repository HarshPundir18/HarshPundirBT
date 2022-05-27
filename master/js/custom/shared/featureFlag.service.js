(function(){
    'use strict';

    angular
        .module('custom')
        .service('featureFlagService', featureFlagService);

    featureFlagService.$inject = ['$http', 'Notify'];
    function featureFlagService ($http, Notify) {
        
        var baseUrl = '/api/feature-flag';

        var _get = function(featureFlagName){
            return $http.get(`${baseUrl}/${featureFlagName}`);
        }

        this.get = _get;
    }
})();