
(function() {
    'use strict';

    // usage:  {{mv.In | number : 3 | SmgWeightFilter }}
    angular
        .module('custom')
        .filter('SmgWeightFilter', SmgWeightFilter);


        function SmgWeightFilter($filter){
            return function(input) {
                return input + " kg"
                //return $filter('number')(input) + 'Kg';
            }
        }

})();