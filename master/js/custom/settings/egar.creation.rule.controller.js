(function() {
    'use strict';

    angular
        .module('custom')
        .controller('EgarCreationRulesController', EgarCreationRulesController);

    EgarCreationRulesController.$inject = ['$location', '$state', '$stateParams', 'egarRulesService', 'garsService',
    'spinnerService', 'utilsService', 'SMG_ESTABLISHMENT_TYPES'];
    function EgarCreationRulesController($location, $state, $stateParams, egarRulesService, garsService,
        spinnerService, utilsService, SMG_ESTABLISHMENT_TYPES) {
        
        //VM stuff
        var vm = this;
        vm.isEdit = false;
        vm.isDuplicate = false;
        vm.SMG_ESTABLISHMENT_TYPES = SMG_ESTABLISHMENT_TYPES;

        vm.smgSelectProductsReady = false;
        vm.smgSelectAccountEstablishment = 'smgSelectAccountEstablishment';
        vm.smgSelectDestinEstablishment = 'smgSelectDestinEstablishment';
        vm.smgSelectProductCode = 'smgSelectProducts';
        vm.smgSelectProductGroup = 'smgSelectProductGroup';
        vm.smgSelectUser = 'smgSelectUser';
        vm.smgSelectLer1 = 'smgSelectLer1';
        vm.smgSelectLer2 = 'smgSelectLer2';
        vm.smgSelectOperation = 'smgSelectOperation';
        vm.smgSelectGroup1 = 'smgSelectGroup1';
        vm.smgSelectGroup2 = 'smgSelectGroup2';
        vm.smgSelectServiceArea = 'smgSelectServiceArea';
        vm.smgSelectOnuNumber = 'selectOnuNumber';
        vm.smgSelectOnuNumberPackage = 'selectOnuNumberPackage';
        vm.selectedServiceArea = null;
        vm.items = [];
        vm.offset = 0;
        vm.pageSize = 200;
        vm.previousSearch = '';
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        vm.egarTypes = garsService.egarTypes();
        vm.selectedEgarType = vm.egarTypes[0].key;
        
        spinnerService.show('#newGarCreationRule');

        vm.$onInit = function(){
            if($stateParams.id){
                if($location.url().indexOf('duplicate') > 0){
                    vm.isDuplicate = true;
                } else {
                    vm.isEdit = true;
                }
                
                egarRulesService.get($stateParams.id)
                    .then((result)=>{
                        var items = result.data.Items;
                        if(items && items.length > 0){
                            var egarRule = items[0];
                            vm.selectedLer1Key = egarRule.LerCode1;
                            vm.selectedGroup1Key = egarRule.LerCode1Group;
                            vm.goup1IsMandatory = garsService.shouldSelectGroupBeEnabled(egarRule.LerCode1);

                            vm.selectedLer2Key = egarRule.LerCode2;
                            vm.selectedGroup2Key = egarRule.LerCode2Group;
                            vm.goup2IsMandatory = garsService.shouldSelectGroupBeEnabled(egarRule.LerCode2);

                            vm.selectedOperationKey = egarRule.OperationCode;

                            vm.selectedAccountEstablishmentKey = egarRule.AccountEstablishmentId;
                            vm.selectedDestinEstablishmentKey = egarRule.DestinEstablishmentId;
                            vm.selectedServiceAreaKey = egarRule.ServiceAreaCodeId;
                            vm.selectedProductGroupKey = egarRule.ProductGroupCodeId;
                            vm.selectedEgarType= egarRule.EGarType;

                            vm.isAdr = egarRule.OnuNumber != null || egarRule.OnuNumberPackage != null;
                            vm.selectedOnuNumber = egarRule.OnuNumber;
                            vm.onuNumberPackage = egarRule.OnuNumberPackage;

                            console.log(egarRule);

                            spinnerService.hide('#newGarCreationRule')
                        }
                    })
                    .catch()
                    .finally();
            } else{
                spinnerService.hide('#newGarCreationRule');
            }
        }  

        vm.onBackClick = function(){
            $state.go('app.appSettingsEgarCreationRules');
        }
        
        vm.onSelectedServiceAreaChange = function (obj){
            console.log('vm.onSelectedServiceAreaChange');
        };

        vm.onSelectedLer1Change = function(obj){
            if(obj){
                vm.goup1IsMandatory = garsService.shouldSelectGroupBeEnabled(obj.key);
            }else{
                vm.selectedGroup1 = null;
                vm.goup1IsMandatory = false;
            }
        }

        vm.onSelectedLer2Change = function(obj){
            if(obj){
                vm.goup2IsMandatory = garsService.shouldSelectGroupBeEnabled(obj.key);
            } else {
                vm.selectedGroup2 = null;
                vm.goup2IsMandatory = false;
            }
        }

        vm.onSelectedOperationChange = function(obj){
            console.log('page: ' + 'onSelectedOperationChange');
        }

        vm.onSelectedGroupChange = function(obj){
            console.log('page: ' + 'onSelectedGroupChange');
        }

        vm.onSelectedProductGroupChange = function(){
            console.log('page: ' + 'onSelectedProductGroupChange');
        }

        vm.onAdrChange = function(type, obj){
            console.log(vm.adr);
        }

        vm.onAccountEstablishmentChange = function(obj){
            vm.selectedAccountEstablishment = obj;
            vm.selectedAccountEstablishmentKey = obj.uniqueId;
            //console.log(obj);
        }

        vm.onDestinEstablishmentChange = function(obj){
            vm.selectedDestinEstablishment = obj;
            vm.selectedDestinEstablishmentKey = obj.uniqueId;
            //console.log(obj);
        }

        vm.validateInput = function(name, type) {
            if(name == vm.smgSelectAccountEstablishment){
                return vm.submitted && vm.selectedAccountEstablishment == null;
            } else if(name == vm.smgSelectDestinEstablishment){
                return vm.submitted && vm.selectedDestinEstablishment == null;
            } else if(name === vm.smgSelectUser){
                return vm.submitted && vm.selectedUser == null;
            } else if(name === vm.smgSelectLer1){
                return vm.submitted && vm.selectedLer1 == null;
            } else if(name === vm.smgSelectLer2){
                return vm.submitted && vm.selectedLer2 == null;
            } else if(name === vm.smgSelectOperation){
                return vm.submitted && vm.selectedOperation == null;
            } else if(name === vm.smgSelectGroup1){
                return vm.submitted && vm.selectedGroup1 == null && vm.goup1IsMandatory;
            } else if(name === vm.smgSelectGroup2){
                return vm.submitted && vm.selectedGroup2 == null && vm.goup2IsMandatory;
            } else if(name === vm.smgSelectServiceArea){
                return vm.submitted && vm.selectedServiceArea == null;
            } else if(name == vm.smgSelectProductCode){
                return vm.submitted && vm.selectedProductCode == null;
            }else if(name == vm.smgSelectProductGroup){
                return vm.submitted && vm.selectedProductGroup == null;
            }else if(name == vm.smgSelectOnuNumber){
                return vm.submitted && vm.onuNumber == null;
            }else if(name == vm.smgSelectOnuNumberPackage){
                return vm.submitted && vm.onuNumberPackage == null;
            } 
            else{
                var input = vm.newGarCreationRuleForm[name];
                var errorType = input.$error[type];
                var result = (input.$dirty || vm.submitted) && errorType;
                return result;    
            }
        };

        vm.submitForm = function() {
            vm.serverValidationErrors = [];
            vm.submitted = true;

            if (vm.newGarCreationRuleForm.$valid && allOtherFieldsAreValid()) {
                var data = {
                    AccountEstablishmentId: vm.selectedAccountEstablishment.uniqueId,
                    DestinEstablishmentId: vm.selectedDestinEstablishment.uniqueId,
                    ServiceAreaId: vm.selectedServiceArea.key,
                    TagGroupId: vm.selectedProductGroup.uniqueId,
                    TagId: null,
                    LerCode1: vm.selectedLer1.key,
                    LerCode2: vm.selectedLer2 ? vm.selectedLer2.key : null,
                    Group1: vm.selectedGroup1 ? vm.selectedGroup1.key : null,
                    Group2: vm.selectedGroup2 ? vm.selectedGroup2.key : null,
                    OperationCode: vm.selectedOperation.key,
                    EgarType: vm.selectedEgarType,
                    OnuNumber:  vm.onuNumber ? vm.onuNumber.code : null,
                    PackageGroup: vm.onuNumberPackage,
                    Obs1: vm.obsI
                };

                var promise = null;
                var msg = '';
                if(vm.isEdit){
                    promise = egarRulesService.update($stateParams.id, data);
                    msg  = 'Regra editada com sucesso!';
                } 
                else {
                    promise = egarRulesService.create(data)
                    msg = 'Regra criada com sucesso!';
                }
                
                promise.then((result)=>{
                    utilsService.notifySuccess(msg);
                    $state.go('app.appSettingsEgarCreationRules', {hash:vm.hash});
                })
                .catch((error)=>{
                    utilsService.notifyError('Não foi possível efetuar a operação. Se o erro continuar por favor contacte o suporte.');
                });

            }else{
                console.log('invalid');
            }
        }

        activate();

        //CALLBACKS

        //PRIVATES
        function activate(){
            
        }

        function allOtherFieldsAreValid(){
            var flag = vm.submitted 
                && vm.selectedAccountEstablishment != null
                && vm.selectedDestinEstablishment != null
                && vm.selectedLer1 != null
                && vm.selectedOperation != null
                && vm.selectedServiceArea != null
                && vm.selectedProductGroup != null
                ;
                            
                if(!flag){
                    return false;
                }
                
                if(vm.goup1IsMandatory){
                    return flag && vm.selectedGroup1;
                }
                
                if(vm.goup2IsMandatory){
                    return flag && vm.selectedGroup2;
                }

                if(vm.isAdr){
                    return flag && vm.onuNumber != null && vm.onuNumberPackage != null;
                }

                return flag;
                            
        }

        function checkHideSpinner(){
            if(vm.smgSelectProductsReady && vm.smgSelectLerReady){
                spinnerService.hide('#newGarCreationRule');
            }
        }

        // //SCOPE stuff
        // $scope.$on(`fetchProductsFinished_${vm.smgSelectProducts}`, function(event, item){
        //     vm.smgSelectProductsReady = true;
        //     checkHideSpinner();
        // });

        // //SCOPE stuff
        // $scope.$on(`fetchLerFinished_${vm.smgSelectLer}`, function(event, item){
        //     vm.smgSelectLerReady = true;
        //     checkHideSpinner();
        // });
  

    }
})();