(function() {
    'use strict';

    angular
        .module('custom')
        .controller('companiesController', companiesController);

    companiesController.$inject = ['$state', '$scope', '$q', '$stateParams', 'companiesService'];
    function companiesController($state, $scope, $q, $stateParams, companiesService) {
        
        if($stateParams.companyId){
            companiesService.getCompany($stateParams.companyId).then(onSuccess, onError);
        }
        
        var vm = this;
        vm.serverValidationErrors = [];

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
                var data = {
                    company: {},
                    establishment: {},
                    contactPersons: []
                };
                
                data.company.cc = vm.cc;
                data.company.vat = vm.vat;
                data.company.primaryCae = vm.primaryCae;
                data.company.secondaryCae = vm.secondaryCae;
                
                data.establishment.apa = vm.apa;
                data.establishment.name = vm.name;
                data.establishment.address = vm.address;
                data.establishment.postalCode = vm.postalCode;
                data.establishment.local = vm.local;
                data.establishment.city = vm.city;
                data.establishment.country = vm.country;
                data.establishment.mobile = vm.mobile;
                data.establishment.email = vm.email;
                data.establishment.site = vm.site;
                data.establishment.obs = vm.obs;
                data.establishment.obs = vm.obs;
                data.establishment.startDate = vm.formValidate['startDate'].$viewValue;
                
                data.contactPersons.push({
                    name: vm.person1Name,
                    mobile: vm.person1Mobile,
                    email: vm.person1Email
                }); 
                
                data.contactPersons.push({
                    name: vm.person2Name,
                    mobile: vm.person2Mobile,
                    email: vm.person2Email
                }); 
                
               
                var deferred = $q.defer();
                companiesService.saveCompany(data)
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (err, status) {
                        if(err._validationErrors){
                            for (var i = 0; i < err._met_validationErrorsadata.length; i++) { 
                                vm.serverValidationErrors[err._validationErrors[i].Field] = err._validationErrors[i].Message;
                            }
                        }
                        deferred.reject(err);
                    });

            } else {
              console.log('Not valid!!');
              return false;
            }
        };
        
        vm.cancel = function(){
            $state.go('app.overviewCompanies');
        }
        
        function onSuccess(data){

        }
        
        function onError(config, data, status, statusText){

        }
    }
})();
