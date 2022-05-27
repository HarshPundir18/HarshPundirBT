(function(){
    'use strict';

    angular
        .module('custom')
        .service('establishmentService', establishmentService);

    establishmentService.$inject = ['$http', '$q', '$log', '$state', '$location'];
    function establishmentService ($http, $q, $log, $state, $location) {

    	var _create = function (data) {
            return $http.post('/api/establishments', data);
    	};
       
        var _update = function (establishmentId, data) {
            return $http.put('/api/establishments/' + establishmentId, data);
        };
        
        var _getEstablishment = function(establishmentId){
            return $http.get('/api/establishments/' + establishmentId);
        }

        var _getEstablishmentsPage = function(start, pageSize, searchItems){
            return $http.get(buildFetchUrlV2(start, pageSize, searchItems))
        }

        var _deleteEstablishment = function(establishmentId){
            return $http.delete('/api/establishments/' + establishmentId);
        }

        var _getRemoteEstablishmentsByVat = function(vat) {
            return $http.get('/api/egar/establishments/' + vat);
        }

        var _validateAccess = function(username, password){
            return $http.post('/api/establishments/validate-access', { Username: username, Password: password  });
        }

        var _validateMyEstablishmentAccess = function(username, password){
            return $http.post('/api/establishments/validate-my-access', { Username: username, Password: password  });
        }

        var _saveAccess = function(establishmentId, username, password){
            return $http.post('/api/establishments/'+establishmentId+'/save-access', { Username: username, Password: password  });
        }
        
        var _removeAccess = function(establishmentId){
            return $http.post('/api/establishments/'+establishmentId+'/remove-access');
        }

        var _getUsersEstablishmentPermissions = function(establishmentId){
            return $http.get('/api/establishments/' + establishmentId + '/users');
        }

        //start client/default
        var _createDefault = function (data) {
            return $http.post('/api/establishments/default', data);
    	};

        var _updateDefault = function (establishmentId, data) {
            return $http.put('/api/establishments/my/' + establishmentId, data);
    	};

        var _getDefaultEstablishment = function(establishmentId){
            return $http.get('/api/establishments/my/' + establishmentId);
        }

        var _getAllClientEstablishments = function(dataTable){
            var url = _buildAllClientEstablishmentsFetchUrl(dataTable);
            return $http.get(url);
        }

        var _buildAllClientEstablishmentsFetchUrl = function(dataTable) {
            var searchTerm = null;
            if (dataTable.search && dataTable.search.value && dataTable.search.value.length > 2) {
                searchTerm = '&searchTerm=' + dataTable.search.value;
            } else {
                searchTerm = '';
            }

            var fetchUrl = window.appSettings.apiHost + '/api/establishments/account-establishments?start=' + dataTable.start + '&pageSize=' + dataTable.length + searchTerm;

            return fetchUrl;
        }

        var _getAllowedClientEstablishments = function(){
            return $http.get('/api/establishments/select-account-establishments');
        }

        var _getAllowedUserEstablishments = function(){
            return $http.get('/api/establishments/select-users-establishments');
        }

        var _getAvailableEstablishmentsV2 = function(offset, limit, search, type){
            var url = `/api/establishments/select-establishments?offset=${offset}&limit=${limit}`;
            if(search && search.length > 0){
                url = `${url}&searchTerm=${search}`;
            }
            
            if(type && type.length > 0){
                url = `${url}&type=${type}`;
            }

            return $http.get(url);
        };


        function buildFetchUrlV2(start, pageSize, searchItems) {
            var filters = '';            
            if(searchItems){
                for(var i=0; i<searchItems.length; i++){
                    var item = searchItems[i];
                    if(item.value && item.value.trim().length > 0) {
                        filters += `&${item.key}=${item.value}`; 
                    }
                }
            }   
                   
            return `${window.appSettings.apiHost}/api/establishments?start=${start}&pageSize=${pageSize}${filters}`;
        }


        this.updateDefault  = _updateDefault;
        this.getDefaultEstablishment = _getDefaultEstablishment;
        this.getEstablishment = _getEstablishment;
        this.create = _create;
        this.update = _update;
        this.deleteEstablishment = _deleteEstablishment;
        this.getRemoteEstablishmentsByVat = _getRemoteEstablishmentsByVat;
        this.createDefault = _createDefault;
        this.validateAccess = _validateAccess;
        this.validateMyEstablishmentAccess = _validateMyEstablishmentAccess;
        this.saveAccess = _saveAccess;
        this.removeAccess = _removeAccess;
        this.getUsersEstablishmentPermissions = _getUsersEstablishmentPermissions;
        this.getAllClientEstablishments = _getAllClientEstablishments;
        this.getAllowedClientEstablishments = _getAllowedClientEstablishments;
        this.getAllowedUserEstablishments = _getAllowedUserEstablishments;
        this.getAvailableEstablishmentsV2 = _getAvailableEstablishmentsV2;
        this.getEstablishmentsPage = _getEstablishmentsPage;
    }
})();
