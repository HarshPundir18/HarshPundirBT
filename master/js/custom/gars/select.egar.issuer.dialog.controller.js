(function() {
    'use strict';

    angular
        .module('custom')
        .controller('selectEgarIssuerDialogController', selectEgarIssuerDialogController);

    selectEgarIssuerDialogController.$inject = ['$window', '$rootScope', '$scope', '$compile', '$http', '$state', '$filter',
                                    'translationService', 'utilsService', 'ngDialog', 'entities'];
    function selectEgarIssuerDialogController($window, $rootScope, $scope, $compile, $http, $state, $filter,
                                    translationService, utilsService, ngDialog, entities) {
        
        //VM stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        vm.entities = entities;
        vm.msg2 = "qqqqq";


        vm.selectButtonClick = function(){
            var elements = angular.element(".issuer:checked");
            if(elements && elements[0]){
                $scope.selectedIssuer = elements[0].value;
                ngDialog.close();
            }
            
            vm.showErrorMessage = translationService.translate("must-select-issuer");
        }

        //
        activate();

        //CALLBACKS

        //PRIVATES
        function activate(){

        }

        //SCOPE stuff
    }
})();