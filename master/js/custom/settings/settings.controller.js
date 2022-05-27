(function() {
    'use strict';

    angular
        .module('custom')
        .controller('settingsController', settingsController);

    settingsController.$inject = ['$scope', '$state', '$stateParams', 'settingsService', 'spinnerService', 'translationService', 'utilsService', 'ngDialog',];
    function settingsController($scope, $state, $stateParams, settingsService, spinnerService, translationService, utilsService, ngDialog) {
        
        //VM stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        vm.clientSettings = {};      
        
        
        $scope.setTab = function(newTab){
            $scope.tab = newTab;
        };
    
        $scope.isSet = function(tabNum){
            return $scope.tab === tabNum;
        };

       var tabId =  parseInt($stateParams.tabId);
        if($stateParams.tabId && angular.isNumber(tabId)){
            $scope.tab = tabId;      
        }else{
            $scope.tab = 1;      
        }

        vm.$onInit = function(){
            spinnerService.show('#settings');
            settingsService
                .getClientSettings()
                .then((result)=>{
                    if(result.data){
                        vm.clientSettings.sendAutomaticRequestEmails = result.data.SendAutomaticRequestEmails;
                        vm.clientSettings.duplicateEgarQuantity = result.data.DuplicateEgarQuantity;
                    }
                })
                .catch((error)=>{
                    utilsService.notifyError('Não foi possível obter as configurações. <br> Se esta situação persistir por favor contacte o suporte.');
                })
                .finally(spinnerService.hide('#settings'));
        };


        vm.onBackClick = function(){
            $state.go('app.dashboard');
        }

        vm.submitFormClientSettings = function(){
            if (vm.formClientSettings.$valid) {
                var data = {};
                data.SendAutomaticRequestEmails = vm.clientSettings.sendAutomaticRequestEmails;
                spinnerService.show('#settings');
                settingsService
                    .saveClientSettings(data)
                    .then((result) => {
                        utilsService.notifySuccess('Configurações atualizadas com sucesso.');
                    })
                    .catch((error) => {
                        utilsService.notifyError('Não foi possível gravar as configurações. <br> Se esta situação persistir por favor contacte o suporte.');
                    })
                    .finally(spinnerService.hide('#settings'));
            }
        }

        vm.submitFormEgarSettings = function() {
            if (vm.formClientSettings.$valid) {
                var data = {};
                data.DuplicateEgarQuantity = vm.clientSettings.duplicateEgarQuantity;

                spinnerService.show('#settings');
               
                settingsService
                    .saveEgarSettings(data)
                    .then((result) => {
                        utilsService.notifySuccess('Configurações atualizadas com sucesso.');
                    })
                    .catch((error) => {
                        utilsService.notifyError('Não foi possível gravar as configurações. <br> Se esta situação persistir por favor contacte o suporte.');
                    })
                    .finally(spinnerService.hide('#settings'));
            }
        }

        //
        activate();

        //CALLBACKS

        //PRIVATES
        function activate(){

        }

        //SCOPE stuff
    }
})();