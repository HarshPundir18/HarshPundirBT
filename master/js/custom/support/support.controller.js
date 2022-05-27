(function() {
    'use strict';

    angular
        .module('custom')
        .controller('supportController', supportController);

    supportController.$inject = ['$window', '$rootScope', '$scope', '$compile', '$http', '$state', '$filter', '$routeParams', '$route', '$location',
                                    'spinnerService', 'translationService', 'utilsService', 'supportService', 
                                    'ngDialog'];
    function supportController($window, $rootScope, $scope, $compile, $http, $state, $filter, $routeParams, $route, $location,
                                    spinnerService, translationService, utilsService, supportService,
                                    ngDialog) {
        //VM stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];

        vm.validateInput = function(name, type) {
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

        vm.submitted = false;
        // Submit form
        vm.submitForm = function() {
            vm.serverValidationErrors = [];
            vm.submitted = true;
            if (vm.formValidate.$valid) {
                var data = {
                    Name: vm.name,
                    Email: vm.email,
                    Mobile: vm.mobile,
                    Company: vm.company,
                    Message: vm.message,
                    Type: vm.requestType
                };
                spinnerService.show('.panel-body');
                supportService
                    .requestContact(data)
                    .then(requestContactOnSuccess)
                    .catch(requestContactOnError)
                    ;
            }
        };


        //
        activate();

        //CALLBACKS
        function requestContactOnSuccess(result){
            utilsService.notifySuccess(translationService.translate('contact_request_success'));
        }

        function requestContactOnError(error){
            vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
        }

        //PRIVATES
        function activate(){
            vm.requestType = $location.search().t == 'demo' ? 'demo' : 'contact';
            vm.title = translationService.translate('contact_request');
            vm.description = translationService.translate('demo_request_description');
            if(vm.requestType === 'demo'){
                vm.title = translationService.translate('demo_request');
                vm.description = translationService.translate('demo_request_description');
            }
        }

        //SCOPE stuff
    }
})();