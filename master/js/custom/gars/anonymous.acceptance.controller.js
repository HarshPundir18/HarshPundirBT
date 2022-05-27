(function() {
    'use strict';

    angular
        .module('custom')
        .controller('anonymousAcceptanceController', anonymousAcceptanceController);

    anonymousAcceptanceController.$inject = ['$window', '$scope', '$state', '$stateParams', 
                                    '$filter', 'ngDialog', 
                                    'garsService', 'spinnerService', 'translationService', 'utilsService'];
    function anonymousAcceptanceController($window, $scope, $state, $stateParams, 
                                    $filter, ngDialog,
                                    garsService, spinnerService, translationService, utilsService) {

        //VM  public stuff
        var vm = this;
        vm.gar = null;
        vm.garRectifications = null;
        vm.hash = $stateParams.hash;
        vm.showActions = false;
        vm.isRectifying = false;
        
        //set date on datePicker child controller
        $scope.datepickerDate = new Date();

        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];

        vm.operationCodes = garsService.operationCodes();
        vm.allGroupCodes = garsService.groupCodes();
        vm.lerCodes = garsService.lerCodes();    

        vm.submitted = false;

        vm.validateInput = function(name, type, formName) {
            var input = '';
            if(formName === 'formAnonymousAccept'){
                input = vm.formAnonymousAccept[name];
            }
            else if(formName === 'formAnonymousReject'){
                 input = vm.formAnonymousReject[name];
            }else if(formName === 'formAnonymousRectify'){
                input = vm.formAnonymousRectify[name];
            }else if(formName === 'formAnonymousConfirmRectify'){
                input = vm.formAnonymousConfirmRectify[name];
            }
            
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

        vm.submitFormAnonymousRectify = function(){
            vm.serverValidationErrors = [];
            vm.submitted = true;

            if (vm.formAnonymousRectify.$valid) {
                var dataToSubmit = { 
                    ApaAccess: vm.apaAccess,
                    Quantity: vm.gar.Residue.Quantidade,
                    LerCode: vm.selectedLerCode.key,
                    OperationCode: vm.selectedOperationCode.key,
                    GroupCode: vm.groupCode,
                    Comment: vm.comment,
                    day: $scope.datepickerDate.getDate(),              // yields date
                    month: $scope.datepickerDate.getMonth() + 1,       // yields month (add one as '.getMonth()' is zero indexed)
                    year: $scope.datepickerDate.getFullYear() 
                };

                vm.dialog = ngDialog.open({
                    template: '/app/custom/gars/anonymous.acceptance.confirmRectify.dialog.html',
                    className: 'ngdialog-theme-default request anonymous-confirm-rectify',
                    controller: 'anonymousAcceptanceDialogController as $ctrl',
                    resolve : {
                        gar: function (){ return vm.gar; },
                        hash: function() { return $stateParams.hash; },
                        data: function() { return dataToSubmit; },
                    }
                });
            }
        }

        vm.getFile = function(url){
            $window.open(url, '_blank');
        }

        vm.accept = function(){
            vm.dialog = ngDialog.open({
                template: '/app/custom/gars/anonymous.acceptance.accept.dialog.html',
                className: 'ngdialog-theme-default request anonymous-emission-accept',
                controller: 'anonymousAcceptanceDialogController as $ctrl',
                resolve : {
                        gar: function (){ return vm.gar; },
                        hash: function() { return $stateParams.hash; },
                        data: function() { return null; },
                    }
            });
        }

        vm.reject = function(){
            vm.dialog = ngDialog.open({
                template: '/app/custom/gars/anonymous.acceptance.reject.dialog.html',
                className: 'ngdialog-theme-default request anonymous-emission-reject',
                controller: 'anonymousAcceptanceDialogController as $ctrl',
                resolve : {
                        gar: function (){ return vm.gar; },
                        hash: function() { return $stateParams.hash; },
                        data: function() { return null; },
                    }
            });
        }
        
        vm.rectify = function(){
            if(vm.garRectifications === null){
                garsService
                    .anonymousGetGarRectification(vm.hash)
                    .then(function(result){
                        vm.lastRectification = result.data;
                    })
                    .catch();
            }

            vm.isRectifying = !vm.isRectifying;
            if(vm.isRectifying){
                $('#formAnonymousRectify').slideDown();
                $('#actions').slideUp();
            }else{
                $('#formAnonymousRectify').slideUp();
                $('#actions').slideDown();
            }
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

            vm.showActions = !vm.gar.IsFinished;

            var filteredLerCode =  $filter('filter')(vm.lerCodes, { 'key': result.data.Residue.CodigoResiduoLer });
            if(filteredLerCode && filteredLerCode.length > 0){
                vm.selectedLerCode = filteredLerCode[0];
            }

            var filteredOperationCode =  $filter('filter')(vm.operationCodes, { 'key': result.data.Residue.CodigoOperacao });
            if(filteredOperationCode && filteredOperationCode.length > 0){
                vm.selectedOperationCode = filteredOperationCode[0];
            }

            if(result.data.Residue.CodigoGrupo){
                var filteredGroupCode =  $filter('filter')(vm.allGroupCodes, { 'key': result.data.Residue.CodigoGrupo });
                if(filteredGroupCode && filteredGroupCode.length > 0){
                     vm.selectedGroupCode = filteredGroupCode[0].value;
                     vm.groupCode = filteredGroupCode[0].key;
                     vm.showGroupCode = true;
                }
            }
        }

        function getRequestAuthorizationOnError(error){
            //TODO
        }

        //SCOPE stuff
        $scope.$on('datepickerControllerChanged', function (evnt, data) {
            $scope.datepickerDate = data.scopeDate;
        });
    }
})();