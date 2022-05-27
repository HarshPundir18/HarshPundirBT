(function() {
    'use strict';

    angular
        .module('custom')
        .controller('customController', customController);

    customController.$inject = ['$window', '$rootScope', '$scope', '$compile', '$http', '$state', '$filter',
                                    'garsService', 'spinnerService', 'translationService', 'utilsService', 'ngDialog',
                                    'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder'];
    function customController($window, $rootScope, $scope, $compile, $http, $state, $filter,
                                    garsService, spinnerService, translationService, utilsService, ngDialog,
                                    DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        
        //VM stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];

        //
        activate();

        //CALLBACKS

        //PRIVATES
        function activate(){

        }

        //SCOPE stuff
    }
})();