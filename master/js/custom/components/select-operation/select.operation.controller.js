(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-operation/select-operation.html',
        controller: 'SelectOperationController',
        controllerAs: 'vm',
        bindings: {
            name: '@',
            labelText: '@',
            selectionModel: '=',
            selectedKey: '<',
            onChange: '&'
        }
    };
    
    angular
        .module('custom')
        .component('smgSelectOperation', component);

    angular
        .module('custom')
        .controller('SelectOperationController', SelectOperationController);

    SelectOperationController.$inject = ['$element', '$scope', '$filter', 'spinnerService', 'garsService'];
    function SelectOperationController($element, $scope, $filter, spinnerService, garsService) {
        var vm = this;
        vm.offset = 0;
        vm.pageSize = 200;
        vm.items = [];

        vm.onSelectChange = function(){
            //console.log('Component onChange: ' + vm.selectionModel);
            if(vm.onChange) {
                vm.onChange({obj: vm.selectionModel});
            }
        }
       
        vm.fetch = function($select, $event){
            // no event means first load!
            if (!$event) {
                //$scope.items = [];
            } else {               
                $event.stopPropagation();
                $event.preventDefault();
                $scope.page++;
            }


            //if search term is differente from the previous search term, then restart offset
            if(vm.previousSearch != $select.search){
                vm.offset = 0;
            }

            var elem = $element.find('.select-load-more');
            spinnerService.show(elem);
            garsService.operationCodesPage(vm.offset, vm.pageSize, $select.search)
                .then(function (result) {
                    var items = result;
                    if(items && items.length === 0){
                        return;
                    }

                    var newItems = items.map(function(item) {
                        return { 
                            key: item.key,
                            value: item.value
                        };
                    });

                    if(vm.offset === 0){
                        vm.items = newItems;
                    }else{
                        vm.items = vm.items.concat(newItems);
                    }

                    ensureSelectedKeyIsThere(vm.selectedKey);

                    vm.offset += items.length;
                })
                .finally(function(){     
                    spinnerService.hide(elem);   
                    vm.previousSearch = $select.search;
                    $scope.$emit(`fetchOperationFinished_${vm.name}`);          
                });
        }

        function ensureSelectedKeyIsThere(key){
            if(key){
                var filtered = $filter('filter')(vm.items, { 'key': key });
                if(filtered && filtered[0]){
                    vm.selectionModel = filtered[0];
                }
            }
        }


        $scope.$watch('vm.selectedKey', function(newVal, oldVal) {
            ensureSelectedKeyIsThere(newVal);
        });
    }
})();