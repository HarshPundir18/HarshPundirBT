(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/datePickerV2/datePickerV2.html',
        controller: 'DatePickerControllerV2',
        controllerAs: 'vm',
        bindings: {
            dpName: '@',
            dpPlaceholder: '@',
            labelText: '@',
            dpDate: '=',
            dpMinDate: '<?',
            dpMaxDate: '<?',
            hideLabelSpace: '<?'
        }
    };

    angular
        .module('custom')
        .component('smgDatePickerV2', component);

    angular
        .module('custom')
        .controller('DatePickerControllerV2', DatePickerControllerV2);


    DatePickerControllerV2.$inject = ['$rootScope', '$scope', 'dateService']
    function DatePickerControllerV2($rootScope, $scope, dateService) {
        var vm = this;
        
        dateService.changeLocalePt();
        //console.log(`DatePickerControllerV2: ${vm.dpName}`);

        vm.dateOptions = {
            startingDay: 1,
            showWeeks: false,
          };

          //vm.dateOptions.minDate = dateService.getDate();
          //vm.dateOptions.maxDate = dateService.sumMonths(vm.dateOptions.minDate, 1);

        activate();

        ////////////////
        function activate() {
            vm.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                vm.opened = !vm.opened;
            };

            vm.changed = function (dpName) {
                //console.log(`[${dpName}] Date changed to: ${vm.initDate}`);
                $scope.$emit(`datepickerControllerChanged${dpName}`, { dpName: dpName, date: vm.initDate, scopeDate: $scope.endDate  });
            };
        }        
    }
})();