(function () {
    'use strict';

    angular
        .module('custom')
        .controller('testRentokilCreateEgarFromPlanvisController', testRentokilCreateEgarFromPlanvisController);

    testRentokilCreateEgarFromPlanvisController.$inject = ['$scope', 'planVisitService', 'spinnerService'];
    function testRentokilCreateEgarFromPlanvisController($scope, planVisitService, spinnerService) {
        var vm = this;
        vm.errors = [];
        vm.egar = null;
        vm.msg = 'testRentokilCreateEgarFromPlanvisController';


        vm.onClick = function(){
            vm.errors = [];
            vm.egar = null;

            vm.disableSearch = true;
            spinnerService.show('#btn-seach');

            planVisitService
                .testGetEgarFromPlanVisit(vm.planVisitLine)
                .then((result) => {
                    vm.egar = result.data;

                })
                .catch((error) => {
                    if(error.data._applicationErrors && error.data._applicationErrors.length > 0){
                        vm.errors = error.data._applicationErrors;    
                    }
                    console.log('error');
                })
                .finally(()=>{
                    vm.disableSearch = false;
                    spinnerService.hide('#btn-seach');
                });
        }

        vm.onCreateClick = function(){
            vm.disableCreate = true;
            spinnerService.show('#btn-create');

            planVisitService
                .testCreateEgarFromPlanVisit(vm.egar)
                .then((result) => {
                    vm.createdEgar = result.data;
                    console.log(result.data);
                })
                .catch((error) => {
                    if(error.data._applicationErrors && error.data._applicationErrors.length > 0){
                        vm.errors = error.data._applicationErrors;    
                    }
                    console.log('error');
                })
                .finally(()=>{
                    vm.disableCreate = false;
                    spinnerService.hide('#btn-create');
                });
        }
        

    }
})();