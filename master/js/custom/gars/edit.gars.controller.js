
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('editGarsController', editGarsController);

    editGarsController.$inject = ['$q', '$scope', '$location', '$log', '$filter', 
                                   '$state', '$stateParams',
                                    'dummyService', 'garsService', 'spinnerService', 'utilsService',
                                    'SMG_TEXT_SEARCH_TYPES'];
    function editGarsController($q, $scope, $location, $log, $filter,
                                    $state, $stateParams,
                                    dummyService, garsService, spinnerService, utilsService,
                                    SMG_TEXT_SEARCH_TYPES) {

        spinnerService.show('#main');
        //initialize vars
        var editEgarInFlight = null;
        var vm = this;
        vm.SMG_TEXT_SEARCH_TYPES = SMG_TEXT_SEARCH_TYPES;
        vm.formMode = null;

        $scope.datepickerDate = new Date();

        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        vm.tagsArray = [];

        vm.currentTransporterIndex = 0;
        vm.transportersArray = [];

        vm.operationCodes = garsService.operationCodes();

        vm.lerCodes = garsService.lerCodes();        

        vm.groupCode = null;
        vm.allGroupCodes = garsService.groupCodes();

        vm.allProducerType = garsService.producerTypes();

        vm.showGroupCode = false;
        vm.groupCodeForLerCode = garsService.groupCodeForLerCode();

        vm.showPglNumber = false;
        vm.pglNumberForLerCodes = garsService.pglNumberForLerCodes();

        vm.selectedProductCode = null;

        activate();
       
        vm.onSelectedProductCodeChange = function (obj){
            console.log('obj');
        };

        vm.validateInput = function(name, type) {
            if(name == 'groupCode'){
                return validateGoupCode();
            }
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

        vm.lerCodeChange = function(){
            vm.showGroupCode = $.inArray(vm.selectedLerCode.key, vm.groupCodeForLerCode) > -1;
            vm.showPglNumber = $.inArray(vm.selectedLerCode.key, vm.pglNumberForLerCodes) > -1;
        }

        vm.submitted = false;

        vm.submitForm = function(mode) {
            vm.serverValidationErrors = [];
            vm.serverApplicationErrors = [];
            vm.submitted = true;

            if (vm.formValidate.$valid) {
                //if one creation in flight do not allow create another
                if(editEgarInFlight){
                    console.log('already editing egar...');
                    return;
                }

                spinnerService.show('#main');

                var data = {};

                if(vm.formMode === 'edit'){
                    data.tagIds = buildTags();
                    editEgarInFlight = garsService
                                .edit($stateParams.garId, data)
                                .then(onEditEGarSuccess)
                                .catch(onEditEGarError)
                                .finally(() => {
                                    spinnerService.hide('#main');
                                    editEgarInFlight = null;
                                });

                    return;
                }

                //else is rectifying
                data.endDate = vm.formValidate['endDate'].$viewValue;
                data.quantity = vm.quantity;
                data.selectedLerCode = vm.selectedLerCode.key;
                data.comment = vm.comment;
                data.selectedOperationCode = vm.selectedOperationCode.key;
                data.groupCode = vm.groupCode;
                data.numPgl = vm.numPgl;

                editEgarInFlight = garsService
                                        .rectify($stateParams.garId, data)
                                        .then(onEditEGarSuccess)
                                        .catch(onEditEGarError)
                                        .finally(() => {
                                            spinnerService.hide('#main');
                                            editEgarInFlight = null;
                                        });
            }else{
                 utilsService.notifyInvalidFormValidation();
            }
        };

        vm.cancel = function(){
            goToGarList();
        }

        vm.exception = function(){            
            dummyService
                .throwException()
                .then(function(result){
                    alert("success")
                })
                .catch(function(error){
                    alert("error")
                });
        }

        vm.notFound = function(){
            dummyService
                .notFound()
                .then(function(result){
                    alert("success")
                })
                .catch(function(error){
                    alert("error")
                });
        }

        vm.onTagSeletion = (obj)=>{
            if(obj.resultValue && !tagIsSelected(obj.resultValue)){
                vm.tagsArray.push(obj.resultValue);
            }
        }

        vm.removeTag = (tagToRemove)=>{
            vm.tagsArray = vm.tagsArray.filter(function(tag, index, arr){ 
                return tag.id != tagToRemove.id;
            });
        }

        vm.preCloseCallbackOnScope = function (value) {
            if(confirm('Close it? MainCtrl.OnScope (Value = ' + value + ')')) {
              return true;
            }
            return false;
          };

        vm.openConfirmWithPreCloseCallbackOnScope = function () {
            ngDialog.openConfirm({
              template: 'modalDialogId',
              className: 'ngdialog-theme-default',
              preCloseCallback: 'preCloseCallbackOnScope',
              scope: $scope
            }).then(function (value) {
              console.log('Modal promise resolved. Value: ', value);
            }, function (reason) {
              console.log('Modal promise rejected. Reason: ', reason);
            });
          };

        vm.onSelectedProductCodeChange = (item) => {
        };

        vm.onSelectedServiceAreaChange = (item) =>{
        };

        ////////////////

        function activate() {
            if($state.current.name === 'app.editGar'){
                vm.formMode = 'edit';
            }

            if(!$stateParams.garId){
                $location.path('/');
            }

            spinnerService.show('#main');

            var getEgarRequest = garsService.getEGar($stateParams.garId)
                .then(function(result){
                    vm.eGarToEdit = result.data;
                });


            $q.all([getEgarRequest])
                .then(getEGarOnSuccess)
                .catch(getEGarOnError)
                .finally(()=>{ spinnerService.hide('#main'); });
        }
        
        function getEGarOnSuccess(result){
            vm.number = vm.eGarToEdit.Number;
            vm.verificationCode = vm.eGarToEdit.Code;
            vm.status = vm.eGarToEdit.Status;
            vm.waitingAuthorization = vm.eGarToEdit.FormatedAuthorized;
            vm.statusDate = vm.eGarToEdit.FormatedStatusDate;
            //vm.intervinientType = vm.eGarToEdit.FormatedIntervinientType;

            vm.vatOrigin = vm.eGarToEdit.Origin.Nif;
            vm.nameOrigin = vm.eGarToEdit.Origin.Nome;
            vm.addressOrigin = vm.eGarToEdit.Origin.Address;
            vm.codApaOrigin = vm.eGarToEdit.Origin.CodApa;
            vm.commentOrigin = vm.eGarToEdit.Origin.Comment;
            vm.selectedProducerType = vm.eGarToEdit.FormatedProducerType;

            vm.vatDestin = vm.eGarToEdit.Destin.Nif;
            vm.nameDestin = vm.eGarToEdit.Destin.Nome;
            vm.addressDestin = vm.eGarToEdit.Destin.Address;
            vm.codApaDestin = vm.eGarToEdit.Destin.CodApa;
            vm.commentDestin = vm.eGarToEdit.Destin.Comment;
            vm.numPgl = vm.eGarToEdit.Destin.NumPgl;

            vm.transportersArray = vm.eGarToEdit.Transporters;
            vm.quantity = vm.eGarToEdit.Residue.Quantidade;
            vm.lerDescription = vm.eGarToEdit.Residue.DescricaoResiduo;
            
            var filteredLerCode =  $filter('filter')(vm.lerCodes, { 'key': vm.eGarToEdit.Residue.CodigoResiduoLer });
            if(filteredLerCode && filteredLerCode.length > 0){
                vm.selectedLerCode = filteredLerCode[0];
            }

            var filteredOperationCode =  $filter('filter')(vm.operationCodes, { 'key': vm.eGarToEdit.Residue.CodigoOperacao });
            if(filteredOperationCode && filteredOperationCode.length > 0){
                vm.selectedOperationCode = filteredOperationCode[0];
            }

            if(vm.eGarToEdit.Residue.CodigoGrupo){
                var filteredGroupCode =  $filter('filter')(vm.allGroupCodes, { 'key': vm.eGarToEdit.Residue.CodigoGrupo });
                if(filteredGroupCode && filteredGroupCode.length > 0){
                     vm.groupCodeDescription = filteredGroupCode[0].value;
                     vm.groupCode = filteredGroupCode[0].key;
                     vm.showGroupCode = true;
                }
            }

            if(vm.eGarToEdit.Products && vm.eGarToEdit.Products.length){
                
                vm.tagsArray = vm.eGarToEdit.Products.map(function(item) {
                    return { 
                        id: item.Id,
                        internalCode: item.InternalCode,
                        description: item.Description,
                    };
                });
            }
        }

        function getEGarOnError(error){
            
        }

        function goToGarList(){
            var url = $state.get('app.overviewGars').url;
            $location.url(`/app${url}?back`);
        }

        function onEditEGarSuccess(result){
            goToGarList();

            if(vm.formMode === 'edit'){
                utilsService.notifySuccess('Operação realizada com sucesso');
            } else{
                utilsService.notifySuccess('e-Gar Corrigida com sucesso');
            }
        }

        function onEditEGarError(error, status){
            vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);

            var notificationErrorMessage = '';
            var externalErrors = error.data._externalErrors;
            if(externalErrors){
                for (var i = 0; i < externalErrors.length; i++) { 
                    notificationErrorMessage += '<span>' + externalErrors[i].Message + '</span>';
                }

                utilsService.notifyWarning(notificationErrorMessage);
            }
        }

        function validateGoupCode(){
            if(vm.selectedLerCode){

                var mustValidate = $.inArray(vm.selectedLerCode.key, vm.groupCodeForLerCode) > -1;
                if(mustValidate && (!vm.groupCode  || vm.groupCode.length < 1)){
                    return true; 
                }
                return false;
            }

            return false;  //no error
        }

        var buildTags = ()=>{
            return vm.tagsArray.map(function(item) {
                return item.id;
            });
        }

        ////////////////
        function tagIsSelected(selectedTag) {
            //IE does not support .find() fuck IE
            var result = vm.tagsArray.find(function(tag){
                return tag.id === selectedTag.id;
            });
            return result != null && result != undefined;
        }

        //timePicker event handling
        $scope.$on('timepickerControllerChanged', function (evnt, data) {
            $log.info(data.index);
            $log.info(data.time.getHours() + ':' + data.time.getMinutes())
            
            vm.updateTransporterTime(data.index, data.time)
        });  
    }
})();
