
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('VehicleCreateOrUpdateController', VehicleCreateOrUpdateController);

    VehicleCreateOrUpdateController.$inject = ['$state', '$stateParams', '$scope', '$compile',
                                    'spinnerService', 'vehiclesService', 'utilsService', 
                                    'translationService', 'ngDialog',
                                    'DTDefaultOptions', 'DTColumnBuilder', 'DTOptionsBuilder'];
    function VehicleCreateOrUpdateController($state, $stateParams, $scope, $compile,
                                    spinnerService, vehiclesService, utilsService, 
                                    translationService, ngDialog,
                                    DTDefaultOptions, DTColumnBuilder, DTOptionsBuilder) {
        let vm = this;
        vm.data = {};
        vm.dtInstance = {};
        vm.pageSize = 10;

        vm.vehicleUserDivSelector = '#vehicleUsers';
        vm.isEdit = $stateParams.id ? true : false;
        vm.title =  vm.isEdit ? 'Editar Veículo' : 'Criar Veículo';

        activate();

        configureVehicleUsersTable();

        function activate() {
            if(vm.isEdit){
                spinnerService.show('.panel-body');
                vehiclesService
                    .get($stateParams.id)
                    .then(function(result){
                        if(result.data.Items && result.data.Items.length == 1){
                            var item = result.data.Items[0];
                            vm.data.Registration = item.Registration;
                            vm.data.Description = item.Description;
                            vm.data.Obs = item.Obs;
                        }
                    })
                    .catch(function(error){
                        utilsService.notifyError('Não foi possível obter o Veículo. <br> Se esta situação persistir por favor contacte o suporte.');
                    })
                    .finally(function(){
                        spinnerService.hide('.panel-body');
                    });
            }
        }

        vm.cancel = function(){
            $state.go('app.vehiclesOverview');
        };

        vm.validateInput = function(name, type) {
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };

        // Submit form
        vm.submitForm = function() {
            vm.submitted = true;
            if (vm.formValidate.$valid) {
                spinnerService.show('.panel-body');

                if(vm.isEdit){
                    vehiclesService
                        .update($stateParams.id, vm.data)
                        .then(createOrUpdateOnSuccess)
                        .catch(createOrUpdateOnError)
                        .finally(() => { spinnerService.hide('.panel-body'); });
                }else{
                    vehiclesService
                    .create(vm.data)
                        .then(createOrUpdateOnSuccess)
                        .catch(createOrUpdateOnError)
                        .finally(spinnerService.hide('.panel-body'));
                }
            } else {
              console.log('Not valid!!');
              return false;
            }
        };

        vm.removeAssociationOnClick = function(userId){
            spinnerService.show(vm.vehicleUserDivSelector);
            vehiclesService.removeVehicleUserAssociation($stateParams.id, userId)
                .then((result)=>{ 
                    utilsService.notifySuccess('Associação removida com sucesso!'); 
                    vm.dtInstance.reloadData(null, true);
                })
                .catch((error)=>{ 
                    if(error.status === 400){
                        utilsService.parseAndNotifyApplicationErrors(error.data._applicationErrors);
                        return;
                    }
        
                    //500
                    utilsService.notifyError('Não foi possível remover a associação. <br> Se esta situação persistir por favor contacte o suporte.');    
                })
                .finally(()=>{
                    spinnerService.hide(vm.vehicleUserDivSelector);
                });
        }

        function createOrUpdateOnSuccess(result){
            var msg = '';
            if(vm.isEdit){
                msg = 'Veículo editado com sucesso!';
            } else {
                msg = 'Veículo editado com sucesso!';
            }

            utilsService.notifySuccess(msg);
            $state.go('app.vehiclesOverview')
        }

        function createOrUpdateOnError(error){
            if(error.data._validationErrors){
                vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            }
            
            if(error.data._applicationErrors){
                utilsService.parseAndNotifyApplicationErrors(error.data._applicationErrors);
            }
        }

        function configureVehicleUsersTable() {
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

            vm.dtColumns = [
                DTColumnBuilder.newColumn('email', 'Email')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center'),
                DTColumnBuilder
                    .newColumn('Actions')
                    .notSortable()
                    .withClass('dt-center action-buttons')
                    .renderWith(renderActions)
                ];

            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withOption('responsive', true)
                .withOption('bLengthChange', false)     //hide change page size
                .withOption('bFilter', false)            //show/hide search box
                .withOption('searchDelay', 500)
                .withOption('createdRow', createdRow)   //needed to create row/column actions
                .withOption('ajax', getData)
                .withDataProp('data')
                .withOption('serverSide', true)
                .withPaginationType('full_numbers');
        }

        function renderActions(item, msg, model, cell) {   
            return "<span title='Remover utilizador do veículo' ng-click=vm.removeAssociationOnClick('" + model.uniqueId + "')><em class='fa fa-times'></em></span>";
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT 
            $compile(angular.element(row).contents())($scope);
        }

        function getData(dataTable, callback, settings) {
            spinnerService.show(vm.vehicleUserDivSelector);
            vehiclesService.getVehicleUsersPage($stateParams.id, dataTable.start, dataTable.length, dataTable.search.value)
                .then(function (result) {
                    if (result) {
                        vm.dataTableCurrentStart = result.start;
                        var items = result.data.aaData.map(function(item) {
                            return { 
                                email: item.Email,
                                uniqueId: item.UniqueId,
                            };
                        });
                        vm.dataTableCurrentItems = items;
                        result.data.aaData = items;

                        callback(result.data);
                    }
                }, function (error) {

                })
                .finally(function () {
                    spinnerService.hide(vm.vehicleUserDivSelector);
                });
        }
    }
})();

