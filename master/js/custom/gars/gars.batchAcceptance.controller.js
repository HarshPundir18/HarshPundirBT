
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garsBatchAcceptanceController', garsBatchAcceptanceController);

    garsBatchAcceptanceController.$inject = ['$state', '$log', '$compile', '$scope',
        'spinnerService', 'egarRulesService', 'translationService',
        'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder'];
    function garsBatchAcceptanceController($state, $log, $compile, $scope,
        spinnerService, egarRulesService,translationService,
        DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

        var vm = this;

        activate();

        ////////////////

        function activate() {

        }

    }
})();
