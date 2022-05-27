(function() {
    'use strict';

    angular
        .module('custom')
        .controller('PhoneListController', PhoneListController);

    PhoneListController.$inject = ['$window', '$rootScope', '$scope', '$compile', '$http', '$state', '$filter',
                                    'garsService', 'spinnerService', 'translationService', 'utilsService', 'ngDialog',
                                    'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder'];
    function PhoneListController($window, $rootScope, $scope, $compile, $http, $state, $filter,
                                    garsService, spinnerService, translationService, utilsService, ngDialog,
                                    DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
    
    var vm = this;                                        
    vm.msg = 'Hi from PhoneListController';
    vm.phones = [
              {
                name: 'Nexus S',
                snippet: 'Fast just got faster with Nexus S.......'
              }, {
                name: 'Motorola XOOM™ with Wi-Fi',
                snippet: 'The Next, Next Generation tablet........'
              }, {
                name: 'MOTOROLA XOOM™',
                snippet: 'The Next, Next Generation tablet........'
              }
            ];
    }
})();