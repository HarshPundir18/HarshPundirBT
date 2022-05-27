
(function () {
  'use strict';

  angular
    .module('custom')
    .directive("compareTo", function () {

      return {
        require: "ngModel",
        scope:
        {
          confirmPassword: "=compareTo"
        },
        link: function (scope, element, attributes, modelVal) {
          modelVal.$validators.compareTo = function (val) {
            return val == scope.confirmPassword;
          };
          scope.$watch("confirmPassword", function () {
            modelVal.$validate();
          });
        }
      };
    });

})();