(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-period/select-period.html',
        controller: 'SelectPeriodController',
        bindings: {
            selectedPeriodKey: '=',
            labelText: '@',
            onChange: '&'
        },
    };

    angular
        .module('custom')
        .component('smgSelectPeriod', component);

    angular
        .module('custom')
        .controller('SelectPeriodController', SelectPeriodController);

    function SelectPeriodController($filter, reportService, translationService) {

        var vm = this;
        vm.periods = [];
                
        getPeriods();

        function getPeriods(){
            reportService
                .getPeriods()
                .then(function (result) {
                    angular.forEach(result.data, function (value, key) {
                        var period = {
                            key: value.Period,
                            value: translationService.translateDateStuff(value.Month) + '(' + value.Year + ')'
                        }
                        vm.periods.push(period);
                    });

                    if(vm.selectedPeriodKey){
                        setSelectedPeriod();
                    }else{
                        vm.selectedPeriod = vm.periods[0];
                    }
                });
        }

        function setSelectedPeriod(){
            var periodArray = $filter('filter')(vm.periods, function (period) { 
                                                            return period.key === vm.selectedPeriodKey; 
                                                        });

            if(periodArray && periodArray[0]){
                vm.selectedPeriod = periodArray[0];
            }else{
                vm.selectedPeriod = vm.periods[0];
            }

            //set parent var
            vm.selectedPeriodKey = vm.selectedPeriod.key;
        }

        vm.onSelectionChange = function(){
            vm.onChange({selected: vm.selectedPeriod});
        }
    }
})();