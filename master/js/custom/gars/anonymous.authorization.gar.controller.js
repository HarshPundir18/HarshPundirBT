(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garRequestAuthorizationController', garRequestAuthorizationController);

    garRequestAuthorizationController.$inject = ['$window', '$rootScope', '$scope', '$state', '$stateParams', '$filter', 'ngDialog',
                                    'garsService', 'spinnerService', 'translationService', 'utilsService'];
    function garRequestAuthorizationController($window, $rootScope, $scope, $state, $stateParams, $filter, ngDialog,
                                    garsService, spinnerService, translationService, utilsService) {

        //VM  public stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];

        vm.operationCodes = garsService.operationCodes();

        vm.lerCodes = garsService.lerCodes();    

        vm.getFile = function(url){
            $window.open(url, '_blank');
        }

        vm.authorize = function(){
            vm.dialog = ngDialog.open({
                template: '/app/custom/gars/anonymous.dialog.authorize.gar.html',
                className: 'ngdialog-theme-default anonymous-authorize',
                preCloseCallback: 'preCloseCallbackOnScope',
                controller: 'garAuthorizeDialogController as $ctrl',
                resolve : {
                    gar: function (){ return vm.gar; },
                    hash: function() { return $stateParams.hash; }
                }
            });
        }

        //
        activate();

        //PRIVATES
         function activate() {
            if(!$stateParams.hash){
                $state.go('app.dashboard');
            }

            garsService.anonymousGetEgar($stateParams.hash)
                .then(getRequestAuthorizationOnSuccess)
                .catch(getRequestAuthorizationOnError);
        }
        
		//CALLBACKS
        function getRequestAuthorizationOnSuccess(result){
            vm.gar = result.data;

            var filteredLerCode =  $filter('filter')(vm.lerCodes, { 'key': result.data.Residue.CodigoResiduoLer });
            if(filteredLerCode && filteredLerCode.length > 0){
                vm.selectedLerCode = filteredLerCode[0];
            }

            var filteredOperationCode =  $filter('filter')(vm.operationCodes, { 'key': result.data.Residue.CodigoOperacao });
            if(filteredOperationCode && filteredOperationCode.length > 0){
                vm.selectedOperationCode = filteredOperationCode[0];
            }
        }

        function getRequestAuthorizationOnError(error){
            //TODO
        }

        //SCOPE stuff
        $rootScope.$on('reloadRequestAuthorization', function (evnt, data) {
            activate();
        });
    }
})();