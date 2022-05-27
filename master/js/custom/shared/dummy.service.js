(function(){
    'use strict';

    angular
        .module('custom')
        .service('dummyService', dummyService);

    dummyService.$inject = ['$http', '$log'];
    function dummyService ($http, $log) {

        this.callDummy = function(){
            return $http.get('api/dummy');
		}

        var _throwException = function(){
            return $http.post('api/dummy/Throw');
        }

        var _notFound = function(){
            return $http.post('api/dummy/notFound');
        }

        this.throwException = _throwException;
        this.notFound = _notFound;
    }
})();
