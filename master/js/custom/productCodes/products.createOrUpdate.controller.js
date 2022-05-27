
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('ProductCreateOrUpdateController', ProductCreateOrUpdateController);

    ProductCreateOrUpdateController.$inject = ['$scope', '$state', '$stateParams', 
                                    'spinnerService', 'productCodesService', 'utilsService', 'ngDialog'];
    function ProductCreateOrUpdateController($scope, $state, $stateParams,
                                    spinnerService, productCodesService, utilsService, ngDialog) {
        let vm = this;
        vm.selectProductGroupName = "selectProductGroupName";
        vm.data = {};
        vm.dtInstance = {};
        vm.pageSize = 10;

        vm.isEdit = null;
        if($stateParams.id){
            vm.isEdit = true;
        } else{
            vm.isEdit = false;
        }
        vm.title =  vm.isEdit ? 'Editar Etiqueta' : 'Criar Etiqueta';

        activate();

        function activate() {
            if(vm.isEdit){
                spinnerService.show('.panel-body');
                productCodesService
                    .get($stateParams.id)
                    .then(function(result){
                        vm.data.InternalCode = result.data.Product.InternalCode;
                        vm.data.Description = result.data.Product.Description;
                        vm.data.Obs = result.data.Product.Obs;
                        vm.data.PackageWeight = result.data.Product.PackageWeight;
                        vm.data.IsExSitu = result.data.Product.IsExSitu;
                        vm.hasPackage = vm.data.PackageWeight && vm.data.PackageWeight > 0;

                        notifySetGroup(result.data.Product.GroupId);
                        vm.refresh = true;
                    })
                    .catch(function(error){
                        utilsService.notifyError('Não foi possível obter o Produto. <br> Se esta situação persistir por favor contacte o suporte.');
                    })
                    .finally(function(){
                        spinnerService.hide('.panel-body');
                    });
            }
        }

        vm.cancel = function(){
            $state.go('app.productsList');
        };

        vm.validateInput = function(name, type) {
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

        vm.onSelectedProductGroupChange = function(obj){

        }

        vm.onHasPackageClick = function(){
            console.log('onHasPackageClick');
        }

        // Submit form
        vm.submitForm = function() {
            vm.submitted = true;
            if (vm.formValidate.$valid) {
                spinnerService.show('.panel-body');

                if(vm.selectedProductGroup){
                    vm.data.GroupId = vm.selectedProductGroup.uniqueId;
                }

                if(!vm.hasPackage){
                    vm.data.PackageWeight = null;
                }

                if(vm.isEdit){
                    productCodesService
                        .update($stateParams.id, vm.data)
                        .then(createOrUpdateProductOnSuccess)
                        .catch(createOrUpdateProductOnError)
                        .finally(spinnerService.hide('.panel-body'));
                }else{
                    productCodesService
                    .create(vm.data)
                    .then(createOrUpdateProductOnSuccess)
                    .catch(createOrUpdateProductOnError)
                    .finally(spinnerService.hide('.panel-body'));
                }
            } else {
              console.log('Not valid!!');
              return false;
            }
        };

        function createOrUpdateProductOnSuccess(result){
            var msg = '';
            if(vm.isEdit){
                msg = 'Etiqueta editada com sucesso!';
            } else {
                msg = 'Etiqueta criada com sucesso!';
            }

            utilsService.notifySuccess(msg);
            $state.go('app.productsList')
        }

        function createOrUpdateProductOnError(error){
            if(error.data._validationErrors){
                vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            }
            
            if(error.data._applicationErrors){
                utilsService.parseAndNotifyApplicationErrors(error.data._applicationErrors);
            }
        }

        function notifySetGroup(id){
            var evt = `notifySetProductGroup_${vm.selectProductGroupName}`;
            $scope.$broadcast(evt, id);
        }

        $scope.$on(`fetchProductGroupsFinished_${vm.selectProductGroupName}`, function(event, groupId){
            console.log(`fetchProductGroupsFinished_${vm.selectProductGroupName}`);
        });
    }
})();

