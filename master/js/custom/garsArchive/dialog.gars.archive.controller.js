(function() {
    'use strict';

    angular
        .module('custom')
        .controller('dialogGarsArchiveController', dialogGarsArchiveController);

    dialogGarsArchiveController.$inject = ['$scope', 'garArchiveService', 'oauthService' , 'spinnerService', 'establishment', 'year'];
    function dialogGarsArchiveController($scope, garArchiveService, oauthService, spinnerService, establishment, year) {

        //VM stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];

        vm.year = year;
        vm.accountEstablishment = establishment;
        vm.email = oauthService.loggedUserEmail();

        vm.$onInit = function() {

        }

        vm.submitForm = function () {

            spinnerService.show('.panel-body');
            
            garArchiveService.requestArchive(vm.email, vm.accountEstablishment.UniqueId, vm.year)
                .then(function(result){
                    $scope.closeThisDialog(true);
                })
                .catch(function(error){
                    $scope.closeThisDialog(false);
                })
                .finally(spinnerService.hide('.panel-body'));
        }

        vm.validateInput = function(name, type) {
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
          };

        vm.confirm = function(param){

        }

        //CALLBACKS

        //PRIVATES
        function testFunc(){
            alert('test');
        }


        //SCOPE stuff
    }
})();