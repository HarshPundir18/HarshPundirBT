(function() {
    'use strict';

    angular
        .module('custom')
        .service('collectionService', collectionService);

    collectionService.$inject = ['$http', '$q', '$log', '$state', '$location'];
    function collectionService($http, $q, $log, $state, $location) {

        var _create = function(data) {
            return $http.post(`/api/equipments/create-collection`, data);
        };

        var _getDeliveredEquipments = function() {
            return $http.get(`/api/equipments/delivered`);
        }

        this.create = _create;
        this.getDeliveredEquipments = _getDeliveredEquipments;
    }
})();