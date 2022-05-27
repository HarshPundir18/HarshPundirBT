(function() {
    'use strict';

    angular
        .module('custom')
        .controller('gdprAcceptanceController', gdprAcceptanceController);

    gdprAcceptanceController.$inject = ['$scope', 'securityService'];
    function gdprAcceptanceController($scope, securityService) {
        var vm = this;
     
        vm.submitForm = function(){
            if(!vm.termAndConditions){
                return;
            }

            vm.showErrorMessage = false;
            securityService
                .acceptGdpr()
                .then(function(result){ 
                    $scope.closeThisDialog({
                        action: 'submit',
                        payload: true
                    });
                 })
                 .catch(function(){
                    vm.showErrorMessage = true;
                 });
        }
        
        // vm.cancelClick = function(){
        //     $scope.closeThisDialog({
        //         action: 'cancel',
        //         payload: false
        //     });
        // }
    }
})();