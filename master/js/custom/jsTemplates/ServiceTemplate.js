(function(){
    'use strict';

    angular
        .module('custom')
        .service('customService', customService);

    customService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function customService ($http, $q, $log, $state, $location, localStorageService) {

    }
})();
