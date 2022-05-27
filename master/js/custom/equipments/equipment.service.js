(function(){
    'use strict';

    angular
        .module('custom')
        .service('equipmentService', equipmentService);

    equipmentService.$inject = ['$http', '$q', '$log', '$state', '$location'];
    function equipmentService ($http, $q, $log, $state, $location) {
        
        var _createEquipment = function(data) {
            return $http.post(`${window.appSettings.apiHost}/api/equipments`, data);
        }

        var _update = function(equipmentId, data) {
            return $http.put(`${window.appSettings.apiHost}/api/equipments/` + equipmentId, data);
        }

        var _getEquipments = function() {
            return $http.get(`${window.appSettings.apiHost}/api/equipments`);
        }

        var _getSingleEquipment = function(equipmentId) {
            return $http.get(`${window.appSettings.apiHost}/api/equipments/` + equipmentId);
        }

        var _deleteEquipment = function(equipmentId) {
            return $http.delete(`${window.appSettings.apiHost}/api/equipments/` + equipmentId);
        }

        var _getEquipmentsPage = function(start, pageSize, searchItems){
            return $http.get(buildFetchUrl(start, pageSize, searchItems))
        }

        function buildFetchUrl(start, pageSize, searchItems) {
            var filters = '';            
            if(searchItems){
                for(var i=0; i<searchItems.length; i++){
                    var item = searchItems[i];
                    if(item.value && item.value.trim().length > 0) {
                        filters += `&${item.key}=${item.value}`; 
                    }
                }
            }   
                   
            return `${window.appSettings.apiHost}/api/equipments`;
        }

        // var _getAllClientEquipments = function(dataTable){
        //     var url = _buildAllClientEquipmentsFetchUrl(dataTable);
        //     return $http.get(url);
        // }

        // var _buildAllClientEquipmentsFetchUrl = function(dataTable) {
        //     var searchTerm = null;
        //     if (dataTable.search && dataTable.search.value && dataTable.search.value.length > 2) {
        //         searchTerm = '&searchTerm=' + dataTable.search.value;
        //     } else {
        //         searchTerm = '';
        //     }

        //     var fetchUrl = window.appSettings.apiHost + '/api/equipments/account-equipments?start=' + dataTable.start + '&pageSize=' + dataTable.length + searchTerm;

        //     return fetchUrl;
        // }

        // var _getAvailableEquipmentsV2 = function(offset, limit, search, type){
        //     var url = `/api/equipments/select-equipments?offset=${offset}&limit=${limit}`;
        //     if(search && search.length > 0){
        //         url = `${url}&searchTerm=${search}`;
        //     }
            
        //     if(type && type.length > 0){
        //         url = `${url}&type=${type}`;
        //     }

        //     return $http.get(url);
        // };


        this.createEquipment = _createEquipment;
        this.update = _update;
        this.deleteEquipment = _deleteEquipment;
        this.getEquipments = _getEquipments;
        this.getSingleEquipment = _getSingleEquipment;
        this.getEquipmentsPage = _getEquipmentsPage;
        // this.getAvailableEquipmentsV2 = _getAvailableEquipmentsV2;
        // this.getAllClientEquipments = _getAllClientEquipments;
    }
})();