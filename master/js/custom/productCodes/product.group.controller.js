
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('ProductGroupController', ProductGroupController);

    ProductGroupController.$inject = ['$state', '$stateParams', 'spinnerService', 'productCodesService', 'utilsService', 
        'ngDialog', 'translationService', 'DTDefaultOptions', 'DTColumnBuilder', 'DTOptionsBuilder'];
    function ProductGroupController($state, $stateParams, spinnerService, productCodesService, utilsService, 
        ngDialog, translationService,
        DTDefaultOptions, DTColumnBuilder, DTOptionsBuilder) {
        let vm = this;
        vm.dtInstance = {};
        vm.pageSize = 10;
        vm.data = {};
        vm.isEdit = false;

        configureGroupProductsTable();
    
        if($stateParams.id){
            updateMode();
        }

        vm.onBackClick = () => { $state.go('app.productGroupList'); }

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
                    productCodesService
                        .updateGroup($stateParams.id, vm.data)
                        .then(createOrUpdateGroupOnSuccess)
                        .catch(createOrUpdateGroupOnError)
                        .finally(spinnerService.hide('.panel-body'));
                }else{
                    productCodesService
                        .createGroup(vm.data)
                        .then(createOrUpdateGroupOnSuccess)
                        .catch(createOrUpdateGroupOnError)
                        .finally(spinnerService.hide('.panel-body'));
                }
            } else {
              console.log('Not valid!!');
              return false;
            }
        };

        function updateMode(){
            vm.isEdit = true;
            spinnerService.show('.panel-body');
            productCodesService
                .getGroup($stateParams.id)
                .then(function(result){
                    var item = result.data.ProductGroup;
                    if(item){
                        vm.data.InternalCode = item.InternalCode;
                        vm.data.Description = item.Description;
                        vm.data.Obs = item.Obs;                      
                        }
                })
                .catch(function(error){
                    utilsService.notifyError('Não foi possível obter o Grupo. <br> Se esta situação persistir por favor contacte o suporte.');
                })
                .finally(spinnerService.hide('.panel-body'));
        }

        function createOrUpdateGroupOnSuccess(result){
            var msg = '';
            if(vm.isEdit){
                msg = 'Grupo editado com sucesso!';
            } else {
                msg = 'Grupo criado com sucesso!';
            }

            utilsService.notifySuccess(msg);
            $state.go('app.productGroupList')
        }

        function createOrUpdateGroupOnError(error){
            if(error.data._validationErrors){
                vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            }
            
            if(error.data._applicationErrors){
                utilsService.parseAndNotifyApplicationErrors(error.data._applicationErrors);
            }
        }

        function getData(dataTable, callback, settings) {
            spinnerService.show('#groupProducts');
            productCodesService.getGroupProductsPage($stateParams.id, dataTable.start, dataTable.length, dataTable.search.value)
                .then(function (result) {
                    if (result) {
                        vm.dataTableCurrentStart = result.start;
                        var items = result.data.aaData.map(function(item) {
                            return { 
                                uniqueId: item.UniqueId,
                                internalCode: item.InternalCode,
                                description: item.Description,
                            };
                        });
                        vm.dataTableCurrentItems = items;
                        result.data.aaData = items;

                        callback(result.data);
                    }
                }, function (error) {

                })
                .finally(function () {
                    spinnerService.hide('#groupProducts');
                });
        }

        function configureGroupProductsTable() {
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

            vm.dtColumns = [
                DTColumnBuilder.newColumn('internalCode', 'Código Interno')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center'),
                DTColumnBuilder.newColumn('description', 'Designação')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center')
                ];

            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withOption('responsive', true)
                .withOption('bFilter', true)            //show/hide search box
                .withOption('searchDelay', 500)
                .withOption('bLengthChange', false)     //hide change page size
                .withOption('ajax', getData)
                .withDataProp('data')
                .withOption('serverSide', true)
                .withPaginationType('full_numbers');
        }

    }
})();

