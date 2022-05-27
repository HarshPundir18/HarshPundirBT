(function() {
    'use strict';

    angular
        .module('custom')
        .controller('anonymousRectificationAcceptanceController', anonymousRectificationAcceptanceController);

    anonymousRectificationAcceptanceController.$inject = ['$window', '$scope', '$state', '$stateParams', 
                                    '$filter', 'ngDialog', 
                                    'garsService', 'spinnerService', 'translationService', 'utilsService'];
    function anonymousRectificationAcceptanceController($window, $scope, $state, $stateParams, 
                                    $filter, ngDialog,
                                    garsService, spinnerService, translationService, utilsService) {

        //VM  public stuff
        var vm = this;
        vm.showActions = false;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        vm.operationCodes = garsService.operationCodes();
        vm.lerCodes = garsService.lerCodes();   

        $scope.panelApa = false; 

        vm.acceptRetification = function(){
            vm.dialog = ngDialog.open({
                template: '/app/custom/gars/anonymous.rectification.acceptance.accept.dialog.html',
                className: 'ngdialog-theme-default request consult-rectification',
                controller: 'anonymousRectificationAcceptancePopupController as $ctrl',
                resolve : {
                    //parameter passed to dialog
                    gar: function (){ return vm.gar; },
                    hash: function (){ return $stateParams.hash; }
                }
            });
        }

        vm.rejectRetification = function(){
            vm.dialog = ngDialog.open({
                template: '/app/custom/gars/anonymous.rectification.acceptance.reject.dialog.html',
                className: 'ngdialog-theme-default request consult-rectification',
                controller: 'anonymousRectificationAcceptancePopupController as $ctrl',
                resolve : {
                    //parameter passed to dialog
                    gar: function (){ return vm.gar; },
                    hash: function (){ return $stateParams.hash; }
                }
            });
        }

        vm.getFile = function(url){
            $window.open(url, '_blank');
        }

        activate();


        //PRIVATES
         function activate() {
            if(!$stateParams.hash){
                $state.go('app.dashboard');
            }

            garsService.anonymousGetEgar($stateParams.hash)
                .then(anonymousGetEgarOnSuccess)
                .catch(anonymousGetEgarOnError);

            garsService.anonymousGetGarRectification($stateParams.hash)
                .then(anonymousGetGarRectificationOnSuccess)
                .catch(anonymousGetGarRectificationOnError);
        }
        

		//CALLBACKS
        function anonymousGetEgarOnSuccess(result){
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
        }

        function anonymousGetEgarOnError(error){
            //TODO
        }

        //CALLBACKS
        function anonymousGetGarRectificationOnSuccess(result){
            console.log(result.data)
			vm.destinComment = result.data.DestinComment;
            vm.groupCode = result.data.GroupCode;
            vm.lerCode = result.data.LerCode;
            vm.newGroupCode = result.data.NewGroupCode;
            vm.newLerCode = result.data.NewLerCode;
            vm.newOperationCode = result.data.NewOperationCode;
            vm.newPglNumber = result.data.NewPglNumber;
            vm.newQuantity = result.data.NewQuantity;
            vm.operationCode = result.data.OperationCode;
            vm.originComment = result.data.OriginComment;
            vm.pglNumber = result.data.PglNumber;
            vm.quantity = result.data.Quantity;
            vm.closeDate = result.data.FormatedCloseDate;
        }

        function anonymousGetGarRectificationOnError(error){
            //todo
        }
    }
})();