(function() {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/phone-list/phone-list.html',
        controller: 'PhoneListController',
        bindings: {
            oneWayMessage: '<',
            twoWayMessage: '='
        }
      };

    angular.
        module('custom').
        component('phoneList', component);

})();