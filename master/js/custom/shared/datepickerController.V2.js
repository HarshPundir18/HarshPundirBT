/**=========================================================
 * Module: demo-datepicker.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('custom')
        .controller('datepickerControllerV2', datepickerControllerV2);

    datepickerControllerV2.$inject = ['$rootScope', '$scope', '$log', '$timeout', 'tmhDynamicLocale', '$locale', 'dateService']
    function datepickerControllerV2($rootScope, $scope, $log, $timeout, tmhDynamicLocale, $locale, dateService) {

        //dateService.changeLocalePt();
        // var code = 'pt';
        // $rootScope.model = {selectedLocale: code};
        // $rootScope.changeLocale = tmhDynamicLocale.set(code);
        // $rootScope.$locale = $locale;
        // $rootScope.changeLocale = tmhDynamicLocale.set;

        var vm = this;
        console.log("datepickerControllerV2")
        $scope.endDate= $scope.$parent.datepickerDate;

 

        vm.dateOptions = {
            startingDay: 1,
            minDate: dateService.getDate(),
            showWeeks: false,
          };

        vm.initDate = dateService.getDate();

        activate();


        // $rootScope.$on('greeting', function ($event, message){
        //   $scope.endDate = new Date();
        //   $log.info('Message received');
        // });


        ////////////////

        function activate() {
                vm.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    vm.opened = true;
                };


                vm.changed = function (dpName) {
                    console.log(`[${dpName}] Date changed to: ${vm.initDate}`);
                    $scope.$emit(`datepickerControllerChanged${dpName}`, { dpName: dpName, date: vm.initDate, scopeDate: $scope.endDate  });
                };
        }        
    }
})();


