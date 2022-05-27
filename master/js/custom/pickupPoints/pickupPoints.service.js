(function(){
    'use strict';

    angular
        .module('custom')
        .service('pickupPointsService', pickupPointsService);

    pickupPointsService.$inject = ['$http', 'SMG_CONST_PICKUP_POINTS'];
    function pickupPointsService ($http, SMG_CONST_PICKUP_POINTS) {

        var baseUrl = '/api/pickupPoints';

        var _getPickupPointsOua = function(val){
            var searchTerm = val ? '?searchTerm=' + val : '';
            return $http.get(baseUrl + '/' + SMG_CONST_PICKUP_POINTS.OUA + searchTerm);
        }

        var _getPickupPointsExSitu = function(val){
            var searchTerm = val ? '?searchTerm=' + val : '';
            return $http.get(baseUrl + '/' + SMG_CONST_PICKUP_POINTS.EX_SITU + searchTerm);
        }

        var _getPickupPoints = function(val){
            var searchTerm = val ? '?searchTerm=' + val : '';
            return $http.get(baseUrl + searchTerm);
        }

        var _getPickupPointsPage = function(start, length, internalCode, apaCode, name){
            return $http.get(buildFetchUrl(start, length, internalCode, apaCode, name));
        }
        
        var _deletePickupPoint = function(uniqueId){
            return $http.delete(`${baseUrl}/${uniqueId}`);
        }

        var _getPickupPoint = function(uniqueId){
            return $http.get(`${baseUrl}/${uniqueId}`);
        }

        var _updatePickupPoint = function(uniqueId, data){
            return $http.put(`${baseUrl}/${uniqueId}`, data);
        }

        //get pickuppoints for the select element (dropdown)
        var _getSelectPickupPoint = function(pickupPointType, offset, limit, search){
            var searchTerm = search ? `&searchTerm=${search}` : '';
            return $http.get(`${baseUrl}/select/${pickupPointType}?offset=${offset}&limit=${limit}${searchTerm}`);
        }

        var _import = function(data){
            return $http.get(`${baseUrl}/import?vat=${data.vat}&code=${data.code}`);
        }

        this.getSelectPickupPoint = _getSelectPickupPoint;
        this.getPickupPointsOua = _getPickupPointsOua;
        this.getPickupPointsExSitu = _getPickupPointsExSitu;
        this.getPickupPoints = _getPickupPoints;
        this.getPickupPointsPage = _getPickupPointsPage;
        this.deletePickupPoint = _deletePickupPoint;
        this.getPickupPoint = _getPickupPoint;
        this.updatePickupPoint = _updatePickupPoint;
        this.import = _import;


        var buildFetchUrl = function(start, length, internalCode, apaCode, name) {
            //var searchTerm = dataTable.search.value ? `&searchTerm=${dataTable.search.value}` : '';
            //var url = `${window.appSettings.apiHost}${baseUrl}/page?start=${dataTable.start}&pageSize=${dataTable.length}${searchTerm}`;

            var internalCodeFilter = internalCode ? `&internalCode=${internalCode}` : '';
            var apaCodeFilter = apaCode ? `&apaCode=${apaCode}` : '';
            var nameFilter = name ? `&name=${name}` : '';

            var url = `${window.appSettings.apiHost}${baseUrl}/page?start=${start}&pageSize=${length}${internalCodeFilter}${apaCodeFilter}${nameFilter}`;
            return url;
        }
    }
})();