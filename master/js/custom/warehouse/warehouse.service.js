(function(){
    'use strict';

    angular
        .module('custom')
        .service('warehouseService', warehouseService);

    warehouseService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function warehouseService ($http, $q, $log, $state, $location, localStorageService) {

    }
})();
