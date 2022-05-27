(function(){
    'use strict';

    angular
        .module('custom')
        .service('supportService', supportService);

    supportService.$inject = ['$http', '$state', '$location'];
    function supportService ($http, $state, $location) {

		var baseUrl = '/api/support';

		var _requestContact = function(data){
			return $http.post(baseUrl + '/request-contact', data);
		}

		this.requestContact = _requestContact;
    }
})();
