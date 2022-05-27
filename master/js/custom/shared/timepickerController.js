(function() {
    'use strict';

    angular
        .module('custom')
        .controller('timepickerController', timepickerController);

    function timepickerController($scope) {
        var vm = this;

        activate();

        //////////ze//////

        function activate() {
          vm.mytime = new Date();

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
            vm.mytime = d;
          };

          vm.changed = function (index) {
            $scope.$emit('timepickerControllerChanged', { index: index, time: vm.mytime  });
            console.log('Time changed to: ' + vm.mytime);
          };

          vm.clear = function() {
            vm.mytime = null;
          };
        }
    }
})();