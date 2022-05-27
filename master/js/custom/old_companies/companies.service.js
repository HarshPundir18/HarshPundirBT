(function(){
    'use strict';

    angular
        .module('custom')
        .service('companiesService', companiesService);

    companiesService.$inject = ['$http', '$q', '$log', '$state', '$location'];
    function companiesService ($http, $q, $log, $state, $location) {

    	var _saveCompany = function (data) {
            return $http.post('/api/companies/create', data);
    	};

        var _getCompanies = function(offset, limit, filters, sort) {
                var params = {
                    offset: offset,
                    limit: limit,
                    filters: JSON.stringify(filters),
                    sort: sort
                };

                return $http.get('/api/companies/getAll', { params: params });
        };
        
        var _getCompany = function (companyId) {

            return $http.get('/api/companies/' + companyId);
        }

        
        this.getCompanies = _getCompanies;
        this.getCompany = _getCompany;
    	this.saveCompany = _saveCompany;
    }
})();
