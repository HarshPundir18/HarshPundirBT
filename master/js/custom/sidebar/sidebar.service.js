(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['$http'];
    function SidebarLoader($http) {
        this.getMenu = _getMenu;

        function _getMenu(successCallback, errorCallback) {

            errorCallback = errorCallback || function() { alert('Failure loading menu'); };
                
            return $http.get('/api/security/vertical-menus');
        }
    }
})();