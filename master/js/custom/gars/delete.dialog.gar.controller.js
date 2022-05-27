(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garDeleteDialogController', garDeleteDialogController);

    garDeleteDialogController.$inject = ['$window', '$rootScope', '$scope', 'ngDialog', 'utilsService', 'garsService', 'spinnerService', 'gar'];
    function garDeleteDialogController($window, $rootScope, $scope, ngDialog, utilsService, garsService, spinnerService, gar) {

        var vm = this;     
        vm.gar = gar;
    }
})();