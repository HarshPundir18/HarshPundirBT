
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('ServiceAreaController', ServiceAreaController);

    ServiceAreaController.$inject = ['$scope', '$state', '$stateParams', 'spinnerService', 'serviceAreaService', 'utilsService'];
    function ServiceAreaController($scope, $state, $stateParams, spinnerService, serviceAreaService, utilsService) {
        let vm = this;
        vm.smgSelectUser = 'smgSelectUser';
        vm.selectedUser = null;
        vm.data = {};
        vm.isEdit = false;
        vm.serverValidationErrors = [];

        vm.$onInit = function(){
            console.log('oninit ctrl')
            if($stateParams.id){
                vm.isEdit = true;
                spinnerService.show('#serviceArea');
                serviceAreaService
                    .get($stateParams.id)
                    .then(function(result){
                        if(result.data.Items && result.data.Items[0]){
                            var serviceArea = result.data.Items[0];
                            vm.data.InternalCode = serviceArea.InternalCode;
                            vm.data.Description = serviceArea.Description;
                            vm.data.Obs = serviceArea.Obs;
                            vm.data.AssignedUserId = serviceArea.AssignedToUserId;
                            notifySetUser(vm.data.AssignedUserId);
                        }
                    })
                    .catch(function(error){
                        utilsService.notifyError('Não foi possível obter a Área de Serviço. <br> Se esta situação persistir por favor contacte o suporte.');
                    })
                    .finally(spinnerService.hide('#serviceArea'));
            }
        }

        

        vm.onSelectedUserChange = function(obj){
            console.log('onSelectedUserChange');
        }

        vm.cancel = function(){
            $state.go('app.serviceAreasOverview');
        };

        vm.validateInput = function(name, type) {
            if(name === vm.smgSelectUser){
                return vm.submitted && vm.selectedUser == null;
            }

            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

        // Submit form
        vm.submitForm = function() {
            vm.submitted = true;
            if (vm.formValidate.$valid) {
                vm.data.AssignedUserId = vm.selectedUser.key;

                spinnerService.show('#serviceArea');

                if(vm.isEdit){
                    serviceAreaService
                        .update($stateParams.id, vm.data)
                        .then(onCreateOrUpdateSuccess)
                        .catch(onCreateOrUpdateOnError)
                        .finally(spinnerService.hide('#serviceArea'));
                }else{
                    serviceAreaService
                        .create(vm.data)
                        .then(onCreateOrUpdateSuccess)
                        .catch(onCreateOrUpdateOnError)
                        .finally(spinnerService.hide('#serviceArea'));
                }
            } else {
              console.log('Not valid!!');
              return false;
            }
        };


        function onCreateOrUpdateSuccess(result){
            var msg = '';
            if(vm.isEdit){
                msg = 'Área de Serviço editada com sucesso!';
            } else {
                msg = 'Área de Serviço criada com sucesso!';
            }

            utilsService.notifySuccess(msg);
            $state.go('app.serviceAreasOverview')
        }

        function onCreateOrUpdateOnError(error){
            if(error.data._validationErrors){
                vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            }
            
            if(error.data._applicationErrors){
                utilsService.parseAndNotifyApplicationErrors(error.data._applicationErrors);
            }
        }

        function notifySetUser(id){
            $scope.$broadcast(`notifySetUser_${vm.smgSelectUser}`, id)
        }
    }
})();

