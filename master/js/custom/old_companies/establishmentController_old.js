(function() {
    'use strict';

    angular
        .module('custom')
        .controller('establishmentController_old', establishmentController_old);

    establishmentController_old.$inject = ['$scope', '$q', '$log'];
    function establishmentController_old($scope, $q, $log) {

        var vm = this;
        vm.serverValidationErrors = [];

        activate();

        ////////////////

        function activate() {
          $log.log('I\'m a line from establishmentController_old.js');
        }

        vm.validateInput = function(name, type) {

            var input = vm.formValidate[name];

            var errorType = input.$error[type];

            return (input.$dirty || vm.submitted) && errorType;
          };


        vm.submitted = false;
        // Submit form
        vm.submitForm = function() {
            
            vm.submitted = true;
            if (vm.formValidate.$valid) {
                var data = {};
                 data.apa = vm.apa;
                data.name = vm.name;
                data.address = vm.address;
                data.postalCode = vm.postalCode;
                data.local = vm.local;
                data.city = vm.city;
                data.country = vm.country;
                 data.mobile = vm.mobile;
                data.email = vm.email;
                data.site = vm.site;
                data.obs = vm.obs;
                data.person1Name = vm.person1Name;
                data.person1Mobile = vm.person1Mobile;
                data.person1Email = vm.person1Email;
                data.person2Name = vm.person2Name;
                data.person2Mobile = vm.person2Mobile;
                data.person2Email = vm.person2Email;
                data.obs = vm.obs;
                data.startDate = vm.formValidate['startDate'].$viewValue;

                var deferred = $q.defer();
                // clientService.saveClient(data)
                //     .success(function (response) {
                //         deferred.resolve(response);
                //     })
                //     .error(function (err, status) {
                //         if(err._metadata){
                //             for (var i = 0; i < err._metadata.length; i++) { 
                //                 vm.serverValidationErrors[err._metadata[i].Field] = err._metadata[i].Message;
                //             }
                //         }
                //         deferred.reject(err);
                //     });

            } else {
              console.log('Not valid!!');
              return false;
            }
        };
    }
})();
