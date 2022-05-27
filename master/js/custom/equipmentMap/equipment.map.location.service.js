(function() {
    'use strict';

    angular
        .module('custom')
        .service('equipmentMapLocationService', equipmentMapLocationService);

    equipmentMapLocationService.$inject = ['$http', '$q', '$log', '$state', '$location'];
    function equipmentMapLocationService($http, $q, $log, $state, $location) {

        var _getEquipmentsLocation = function() {
            return $http.get(`/api/equipments/delivered`);
        }

        this.getEquipmentsLocation = _getEquipmentsLocation;
    }
})();