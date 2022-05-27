(function () {
    'use strict';

    angular
        .module('custom')
        .controller('loginController', loginController);

    loginController.$inject = ['$http', '$state', '$log',
        'oauthService', 'establishmentService',
        'contextService', 'spinnerService'];
    function loginController($http, $state, $log,
        oauthService, establishmentService,
        contextService, spinnerService) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            // bind here all data from the form
            vm.account = {};
            // place the message if something goes wrong
            vm.authMsg = '';

            vm.login = function () {
                vm.authMsg = '';
                if (vm.loginForm.$valid) {
                    spinnerService.show('.panel-body')
                    oauthService
                        .login({ username: vm.account.email, password: vm.account.password, clientCode: vm.account.clientCode })
                        .then(onLoginSuccess)
                        .catch(onLoginError)
                        .finally(function () { spinnerService.hide('.panel-body'); });
                }
                else {
                    // set as dirty if the user click directly to login so we show the validation messages
                    /*jshint -W106*/
                    vm.loginForm.account_email.$dirty = true;
                    vm.loginForm.account_password.$dirty = true;
                    vm.loginForm.account_clientCode.$dirty = true;
                }
            };
        }

        function onLoginSuccess(result) {
            vm.authMsg = null;
            oauthService.setLocalStorageData(result.data);
            $state.go('app.dashboard');
        }

        function onLoginError(error) {
            console.log(error);
            vm.authMsg = 'Erro de authenticação';
            if(error.data.error === 'invalid_grant'){
                vm.authMsg = 'Login Inválido';    
            }else if(error.data.error === 'client_blocked'){
                vm.authMsg = 'Conta bloqueada';
                vm.authMsg2 = 'Por favor contacte o suporte através de info@smartgar.com'
            }
            
            oauthService.logOut();
        }

        function onGetDefaultEstablishmentSuccess(result) {
            contextService.setContextEstablishment(result.data);
        }

        function onGetDefaultEstablishmentError(err, status) {

        }
    }
})();
