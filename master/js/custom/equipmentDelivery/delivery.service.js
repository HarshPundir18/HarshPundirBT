(function() {
    'use strict';

    angular
        .module('custom')
        .service('deliveryService', deliveryService);

    deliveryService.$inject = ['$http', '$q', '$log', '$state', '$location'];
    function deliveryService($http, $q, $log, $state, $location) {

        var _create = function(data) {
            return $http.post(`/api/equipments/create-delivery`, data);
        };

        var _getNonDeliveredEquipments = function() {
            return $http.get(`/api/equipments/non-delivered`);
        }

        this.create = _create;
        this.getNonDeliveredEquipments = _getNonDeliveredEquipments;
    }
})();