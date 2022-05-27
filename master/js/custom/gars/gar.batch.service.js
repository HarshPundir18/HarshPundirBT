(function(){
    'use strict';

    angular
        .module('custom')
        .service('egarBatchService', egarBatchService);

    egarBatchService.$inject = ['$http', '$injector', 'SMG_EGAR_TYPES'];
    function egarBatchService ($http, $injector, SMG_EGAR_TYPES) {

        var baseUrl = '/api/egar-batch';

        var _getEgarAcceptanceBatches = function() {
            return $http.get(`${baseUrl}`);
        };

        var _getEgarAcceptanceBatch = function(id){
            return $http.get(`${baseUrl}/${id}`);
        }

        var _getEgarForAcceptanceBatch = function(start, date, serviceAreaCode, userId, productId) {
            var formatedDate = $injector.get('utilsService').formatDateServerParameter(date);

            var url = `${baseUrl}/for-acceptance?pageStart=${start}`;
            if(formatedDate){
                url = `${url}&date=${formatedDate}`;
            }

            if(serviceAreaCode){
                url = `${url}&serviceAreaCode=${serviceAreaCode}`;
            }

            if(productId){
                url = `${url}&productId=${productId}`;
            }

            if(userId){
                url = `${url}&userId=${userId}`;
            }

            return $http.get(url);
        }

        var _createEgarAcceptanceBatch = function(data){
            return $http.post(`${baseUrl}`, data);
        }



        var _getEgarForAcceptRectificationBatch = function(offset, date, destinId, tagId){
            var url = `${baseUrl}/accept-rectification/egars`;

            return $http.post(url, {
                pageStart: offset,
                destinId: destinId,
                tagId,
                date: date
            })
        }


        this.getEgarAcceptanceBatches = _getEgarAcceptanceBatches;
        this.getEgarAcceptanceBatch = _getEgarAcceptanceBatch;
        this.getEgarForAcceptanceBatch = _getEgarForAcceptanceBatch;
        this.createEgarAcceptanceBatch = _createEgarAcceptanceBatch;
        this.getEgarForAcceptRectificationBatch = _getEgarForAcceptRectificationBatch;
    }
})();
