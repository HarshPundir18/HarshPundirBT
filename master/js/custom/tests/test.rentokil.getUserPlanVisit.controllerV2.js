(function () {
    'use strict';

    angular
        .module('custom')
        .controller('testRentokilGetUserPlanvisControllerV2', testRentokilGetUserPlanvisControllerV2);

        testRentokilGetUserPlanvisControllerV2.$inject = ['$scope', 'planVisitService', 'spinnerService'];
    function testRentokilGetUserPlanvisControllerV2($scope, planVisitService, spinnerService) {
        var vm = this;
        vm.errors = [];
        vm.groups = [];
        vm.msg = 'testRentokilGetUserPlanvisControllerV2';

        planVisitService
        .getUserPlanVisit()
        .then((result)=>{
            var data = result.data;
            vm.planVisitDate = data.date;
            vm.groups = data.eGarVisits;
        })
        .catch((error)=>{
            
        })
        .finally(function(){
            spinnerService.hide('#main');
        });
        
        

        vm.onClick = function(){

        }       
    }
})();