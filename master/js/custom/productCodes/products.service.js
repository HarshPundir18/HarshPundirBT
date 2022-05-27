(function(){
    'use strict';

    angular
        .module('custom')
        .service('productCodesService', productCodesService);

    productCodesService.$inject = ['$http'];
    function productCodesService ($http) {

        var baseUrl = '/api/productCodes';
        var baseGroupUrl = `${baseUrl}/groups`;

        //get list of products (table)
        var _getPage = function(start, length, search){
            var searchTerm = search ? `&searchTerm=${search}` : '';
            var url = `${baseUrl}/page?start=${start}&pageSize=${length}${searchTerm}`;
            return $http.get(url);
        };

        //get products for the select element (dropdown)
        var _getSelectProducts = function(offset, limit, search){
            var url = `${baseUrl}/select-products?offset=${offset}&limit=${limit}`;
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



        // var _getSelectProductsItems = function(offset, pageSize, search){
        //     _getSelectProducts(offset, pageSize, search)
        //         .then((result)=>{
        //             var items = result.data;
        //             if(items && items.length === 0){
        //                 return;
        //             }

        //             return items.map(function(item) {
        //                 return { 
        //                     uniqueId: item.UniqueId,
        //                     displayName: `${item.InternalCode} - ${item.Description}`,
        //                     internalCode: item.InternalCode,
        //                     description: item.Description,
        //                 };
        //             });
        //         });
        // }

        //get groups for the select element (dropdown)
        var _getSelectProductGroups = function(offset, limit, search){
            var searchTerm = search ? `&searchTerm=${search}` : '';
            return $http.get(`${baseGroupUrl}/select?offset=${offset}&limit=${limit}${searchTerm}`);
        }

        //get a page of groups
        var _getProductGroupPage = function(offset, limit, search){
            var searchTerm = search ? `&searchTerm=${search}` : '';
            return $http.get(`${baseGroupUrl}?start=${offset}&pageSize=${limit}${searchTerm}`);
        }

        //get a page of products associated with a group
        var _getGroupProductsPage = function(groupId, offset, limit, search){
            var url = `${baseGroupUrl}/${groupId}/products?offset=${offset}&limit=${limit}`;
            if(search && search.length > 0){
                url = `${url}&searchTerm=${search}`;
            }
            return $http.get(url);
        }

        var _getGroup = function(uniqueId){
            return $http.get(`${baseGroupUrl}/${uniqueId}`);
        }

        var _createGroup = function(data){
            return $http.post(`${baseGroupUrl}`, data);
        }

        var _updateGroup = function(uniqueId, data){
            return $http.put(`${baseGroupUrl}/${uniqueId}`, data);
        }

        var _deleteGroup = function(){
            return $http.delete(`${baseGroupUrl}/${uniqueId}`);
        }


        //this.getSelectProductsItems = _getSelectProductsItems;
        this.getSelectProducts = _getSelectProducts;
        this.getSelectProductGroups = _getSelectProductGroups;
        this.getPage = _getPage;
        this.delete = _delete;
        this.get = _get;
        this.update = _update;
        this.create = _create;
        this.getProductGroupPage = _getProductGroupPage;
        this.getGroupProductsPage = _getGroupProductsPage;
        this.getGroup = _getGroup;
        this.createGroup = _createGroup;
        this.updateGroup = _updateGroup;
        this.deleteGroup = _deleteGroup;   


        var buildFetchUrl = function(start, length, search) {
            
        }
    }
})();