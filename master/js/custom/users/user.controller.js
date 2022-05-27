
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('userController', userController);

    userController.$inject = ['$window', '$state', '$rootScope', '$scope',
                                'userService', 'spinnerService', 'oauthService',
                                'translationService', 'utilsService', 'ngDialog'];
    function userController($window, $state, $rootScope, $scope,
                                userService, spinnerService, oauthService,
                                translationService, utilsService, ngDialog) {
        
        //VM stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];

        //
        activate();

        vm.validateInput = function(form, name, type) {
            var formElement = vm[form];
            var input = formElement[name];
            var errorType = input.$error[type];

            return (input.$dirty || vm.submitted) && errorType;
          };

        vm.submitted = false;
        
        // Submit form
        vm.submitFormChangePassword = function() {
            vm.submitted = true;
            if (vm.formChangePassword.$valid) {
                vm.accessInvalidMsg = null;
                var data = {};
                data.CurrentPassword = vm.currentPassword;
                data.NewPassword = vm.newPassword;
                data.ConfirmPassword = vm.confirmPassword;
                spinnerService.show('#changePassword');

                userService
                        .changePassword(data)
                        .then(changePasswordOnSuccess)
                        .catch(changePasswordOnError)
                        .finally(function(){
                            spinnerService.hide('#changePassword');
                        });

            } else {
              console.log('Not valid!!');
              return false;
            }
        };

        vm.removeFromSystemClick = function(){
            //show modal
            vm.dialog = ngDialog.open({
                template: '/app/custom/users/dialog.my.user.delete.html',
                className: 'ngdialog-theme-default request request-acceptance',
                preCloseCallback: preClose,
                width: 900,
                showClose: true,
                controller: 'userController as $ctrl',
                closeByNavigation: true,
            });
        };

        vm.showErrorMessage = false;
        var preClose = (payload) =>{ 
            if(payload === 'submit'){
                userService
                    .removeUserFromSystem()    
                    .then((result)=>{
                        oauthService.logOut();                        
                    })
                    .catch((error)=>{
                        utilsService.notifyError('Não foi possível efectuar a operação. <br> Se o problema persistir por favor contacte o suporte.')
                        vm.showErrorMessage = true;
                    });
            }
            else{
                vm.removeFromSystem = false
            }

            return true;
        }

        //CALLBACKS
        function changePasswordOnSuccess(result){
            ngDialog.close();		
            utilsService.notifySuccess('Password alterada com sucesso!');
            $state.go('app.dashboard')
        }

        function changePasswordOnError(error){
            vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
			vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);
        }

        //PRIVATES
        function activate(){

        }

        //SCOPE stuff
    }
})();