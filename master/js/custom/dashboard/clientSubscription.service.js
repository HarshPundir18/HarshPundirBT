(function () {
    'use strict';

    angular
        .module('custom')
        .service('clientSubscriptionService', clientSubscriptionService);

    clientSubscriptionService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function clientSubscriptionService($http, $q, $log, $state, $location, localStorageService) {

        var baseUrl = '/api/subscriptions';

        var _getClientSubscription = function () {
            return $http.get(baseUrl);
        }

        this.getClientSubscription = _getClientSubscription;
    }
})();
