(function(){
    'use strict';

    angular
        .module('custom')
        .service('egarRulesService', egarRulesService);

    egarRulesService.$inject = ['$http'];
    function egarRulesService ($http) {
        var baseUrl = '/api/egar-rules';

        var _create = function(request){
            return $http.post(baseUrl, request);
        }

        var _update = function(uniqueId, request){
            return $http.put(`${baseUrl}/${uniqueId}`, request);
        }

        var _delete = function(uniqueId){
            return $http.delete(`${baseUrl}/${uniqueId}`);
        }

        var _get = function(uniqueId){
            return $http.get(`${baseUrl}/${uniqueId}`);
        }

        var _getEgarRulesPage = function(start, limit, searchItems){
            var url = _buildFetchUrl(start, limit, searchItems);
            return $http.get(url);
        }

        var _buildFetchUrl = function(start, pageSize, searchItems) {
            var filters = '';            
            if(searchItems){
                for(var i=0; i<searchItems.length; i++){
                    var item = searchItems[i];
                    if(item.value && item.value.trim().length > 0) {
                        filters += `&${item.key}=${item.value}`; 
                    }
                }
            }   
                   
            return `${window.appSettings.apiHost}${baseUrl}?start=${start}&pageSize=${pageSize}${filters}`;
        }

        this.create = _create;
        this.update = _update;
        this.get = _get;
        this.delete = _delete;
        this.getEgarRulesPage = _getEgarRulesPage;
    }
})();
