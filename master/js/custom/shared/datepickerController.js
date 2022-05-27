/**=========================================================
 * Module: demo-datepicker.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('custom')
        .controller('datepickerController', datepickerController);

    datepickerController.$inject = ['$rootScope', '$scope', '$log']
    function datepickerController($rootScope, $scope, $log) {
        var vm = this;
console.log("este")
        $scope.endDate= $scope.$parent.datepickerDate;

        activate();


        // $rootScope.$on('greeting', function ($event, message){
        //   $scope.endDate = new Date();
        //   $log.info('Message received');
        // });

        
        ////////////////

        function activate() {
          vm.today = function() {
            vm.dt = new Date();
          };
          //vm.today();

          vm.clear = function () {
            vm.dt = null;
          };

          // Disable weekend selection
          vm.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
          };

          vm.toggleMin = function() {
            vm.minDate = vm.minDate ? null : new Date();
          };
          vm.toggleMin();

          vm.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
          };

          vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

          vm.initDate = new Date('2019-10-20');
          vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          vm.format = vm.formats[0];

          vm.changed = function (index) {
            console.log('Date changed to: ' + vm.date);
            $scope.$emit('datepickerControllerChanged', { index: index, date: vm.date, scopeDate: $scope.endDate  });
          };
        }
    }
})();


