(function(){
    'use strict';

    angular
        .module('custom')
        .service('serviceAreaService', serviceAreaService);

    serviceAreaService.$inject = ['$http', '$injector'];
    function serviceAreaService ($http, $injector) {

		var baseUrl = '/api/service-areas';

        var _getServiceAreas = function(start, length, filters){
            var url = _buildFetchUrl(start, length, filters);
            return $http.get(url);
        }

        var _get = function(id){
            return $http.get(`${baseUrl}/${id}`);
        }

        var _buildFetchUrl = function(start, length, filtersArray) {
            var filters = $injector.get('utilsService').buildSearchItemsParameter(filtersArray);
            var fetchUrl = `${window.appSettings.apiHost}${baseUrl}?start=${start}&pageSize=${length}${filters}`;
            return fetchUrl;
        }

        var _create = function(data){
            return $http.post(baseUrl, data);
        } 

        var _update = function(id, data){
            return $http.put(`${baseUrl}/${id}`, data);
        } 

        var _delete = function(id){
            return $http.delete(`${baseUrl}/${id}`);
        }
        
        var _getSelectServiceAreas = function(offset, limit, search){
            var url = `${baseUrl}?start=${offset}&pageSize=${limit}`;
            if(search && search.length > 0){
                url = `${url}&searchTerm=${search}`;
            }
            return $http.get(url);
        };


        this.getSelectServiceAreas =_getSelectServiceAreas;
        this.getServiceAreas = _getServiceAreas;
        this.get = _get;
        this.create = _create;
        this.delete = _delete;
        this.update = _update;
    }
})();
