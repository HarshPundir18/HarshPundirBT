(function(){
    'use strict';

    angular
        .module('custom')
        .service('onuNumbersService', onuNumbersService);

    onuNumbersService.$inject = ['$http'];
    function onuNumbersService ($http) {
        
        var _onuNumbers = function(){
            return $http.get('/app/custom/gars/adr_merged.json')
        };
    
        this.onuNumbers = _onuNumbers;
    }
})();