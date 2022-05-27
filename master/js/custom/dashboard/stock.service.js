(function(){
    'use strict';

    angular
        .module('custom')
        .service('stockService', stockService);

    stockService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function stockService ($http, $q, $log, $state, $location, localStorageService) {
		
		var baseUrl = '/api/stock';

		var _getLerCodeStock = function(){
			return $http.get(baseUrl + '/lerCodes');
		}

        var _getTotalLerCodeStockCount = function(){
            return $http.get(baseUrl + '/lerCodes/count');
        }

		this.getLerCodeStock = _getLerCodeStock;
        this.getTotalLerCodeStockCount = _getTotalLerCodeStockCount;
    }
})();
