(function(){
    'use strict';

    angular
        .module('custom')
        .service('vehiclesService', VehiclesService);

    VehiclesService.$inject = ['$http'];
    function VehiclesService ($http) {

        var baseUrl = '/api/vehicles';

        //get list of products (table)
        var _getPage = function(start, length, registrationFilter, assignedToUserIdFilter){
            var registration = registrationFilter ? `&registration=${registrationFilter}` : '';
            var assignedToUserId = assignedToUserIdFilter ? `&assignedToUserId=${assignedToUserIdFilter}` : '';

            var url = `${baseUrl}?start=${start}&pageSize=${length}${registration}${assignedToUserId}`;
            return $http.get(url);
        };

        var _getSelectVehicles = function(offset, limit, search){
            var url = `${baseUrl}/select-vehicles?offset=${offset}&limit=${limit}`;
            if(search && search.length > 0){
                url = `${url}&searchTerm=${search}`;
            }
            return $http.get(url);
        };
        
        var _delete = function(uniqueId){
            return $http.delete(`${baseUrl}/${uniqueId}`);
        };

        var _get = function(uniqueId){
            return $http.get(`${baseUrl}/${uniqueId}`);
        };
        
        var _update = function(uniqueId, data){
            return $http.put(`${baseUrl}/${uniqueId}`, data);
        };

        var _create = function(data){
            return $http.post(baseUrl, data);
        };

        var _getVehicleUsersPage = function(vehicleId,  dataTableStart, dataTableLength, dataTableSearchValue) {
            var search = dataTableSearchValue ? `search=${dataTableSearchValue}` : '';
            return $http.get(`${baseUrl}/${vehicleId}/users?pageStart=${dataTableStart}&pageLimit=${dataTableLength}${search}`);
        }

        var _removeVehicleUserAssociation = function(vehicleId, userId) {
            return $http.delete(`${baseUrl}/${vehicleId}/users/${userId}`);
        }


        var _getSelectVehicles = function(offset, limit, searchTerm){
            var search = searchTerm ? `&searchTerm=${searchTerm}` : '';
            return $http.get(`${baseUrl}/select-vehicles?offset=${offset}&limit=${limit}${search}`);
        }

        //this.getSelectProductsItems = _getSelectProductsItems;
        this.getPage = _getPage;
        this.getSelectVehicles = _getSelectVehicles;
        this.getPage = _getPage;
        this.create = _create;
        this.update = _update;
        this.delete = _delete;
        this.get = _get;
        this.getVehicleUsersPage = _getVehicleUsersPage;
        this.removeVehicleUserAssociation = _removeVehicleUserAssociation;
        this.getSelectVehicles = _getSelectVehicles;
    }
})();