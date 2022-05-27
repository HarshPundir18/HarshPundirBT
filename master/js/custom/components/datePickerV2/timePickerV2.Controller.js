(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/datePickerV2/timePickerV2.html',
        controller: 'TimepickerControllerV2',
        controllerAs: 'vm',
        bindings: {
            tpName: '@',
            tpPlaceholder: '@',
            model: '=',
            labelText: '@',
            hideLabelSpace: '<?'
        }
    };

    angular
        .module('custom')
        .component('smgTimePickerV2', component);

    angular
        .module('custom')
        .controller('TimepickerControllerV2', TimepickerControllerV2);


    TimepickerControllerV2.$inject = ['$rootScope', '$scope', 'dateService']
    function TimepickerControllerV2($rootScope, $scope, dateService) {
        var vm = this;

        activate();

        //////////ze//////

        function activate() {
          vm.model = new Date();

          vm.hstep = 1;
          vm.mstep = 10;

          vm.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
          };

          vm.ismeridian = true;
          vm.toggleMode = function() {
            vm.ismeridian = ! vm.ismeridian;
          };

          vm.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            vm.model = d;
          };

          vm.changed = function (index) {
            //$scope.$emit('timepickerControllerChanged', { index: index, time: vm.mytime  });
            //console.log('Time changed to: ' + vm.mytime);
            //vm.model = vm.mytime;
          };

          vm.clear = function() {
            vm.model = null;
          };
        }
    }
})();