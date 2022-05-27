(function () {
    'use strict';

    angular
        .module('custom')
        .service('dashboardService', dashboardService);

    dashboardService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function dashboardService($http, $q, $log, $state, $location, localStorageService) {

        var baseUrl = '/api/dashboard';

        var _countLegalDeadlines = function () {
            return $http.get(`${baseUrl}/count-egar-legal-deadlines`);
        }

        this.countLegalDeadlines = _countLegalDeadlines;
    }
})();
