(function () {
    'use strict';

    angular
        .module('custom')
        .controller('testGoToAngular9', testGoToAngular9);

        testGoToAngular9.$inject = ['$scope', '$window', '$compile', 'productCodesService'];
    function testGoToAngular9($scope, $window, $compile, productCodesService) {

        //VM stuff
        var vm = this;

        vm.msg="hello testGoToAngular9";

        vm.dateDp1Name = 'dateDp1';
        vm.dateDp2Name = 'dateDp2';
        
      
        vm.goToAngular9 = function(){
            $window.location.href = $window.appSettings.angular9; 
        }
    }
})();