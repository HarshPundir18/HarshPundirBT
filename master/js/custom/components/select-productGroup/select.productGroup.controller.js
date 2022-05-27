(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-productGroup/select-productGroup.html',
        controller: 'SelectProductGroupController',
        controllerAs: 'vm',
        transclude: true,
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
        .component('smgSelectProductGroup', component);

    angular
        .module('custom')
        .controller('SelectProductGroupController', SelectProductGroupController);

    SelectProductGroupController.$inject = ['$element', '$filter', '$scope', 'spinnerService', 'productCodesService'];
    function SelectProductGroupController($element, $filter, $scope, spinnerService, productCodesService) {
        var vm = this;
        vm.items = [];
        vm.offset = 0;
        vm.pageSize = 200;
        vm.previousSearch = '';


        vm.onSelectChange = function(){
            if(vm.onChange) {
                vm.onChange({obj: vm.selectionModel});
            }
        }

        vm.fetch = function ($select, $event){
            // no event means first load!
            if (!$event) {
                //$scope.items = [];
            } else {
                $event.stopPropagation();
                $event.preventDefault();
                $scope.page++;
            }

            var selectSearch = $select && $select.search ? $select.search : '';
            if(vm.previousSearch != selectSearch){
                vm.offset = 0;
            }

            var elem = $element.find('.select-load-more');
            spinnerService.show(elem);
            productCodesService
                .getSelectProductGroups(vm.offset, vm.pageSize, selectSearch)
                .then(function (result) {

                    var items = result.data;
                    if(items && items.length === 0){
                        return;
                    }

                    var newItems = items.map((item) => groupMap(item));

                    if(vm.offset === 0){
                        vm.items = newItems;
                    }else{
                        vm.items = vm.items.concat(newItems);
                    }
                    ensureSelectedKeyIsThere(vm.selectedKey);
                    vm.offset += items.length;

                    $scope.$emit(`fetchProductGroupsFinished_${vm.name}`);
                })
                .finally(function(){
                    spinnerService.hide(elem);
                    vm.previousSearch = $select.search;
                });
        }

        function ensureSelectedKeyIsThere(key){
            if(!key || key.length <= 0){
                return;
            }
            var filtered = $filter('filter')(vm.items, { 'key': key });
            if(filtered && filtered[0]){
                setSelectedItem(filtered[0]);
            }else{
                productCodesService
                    .getGroup(key)
                    .then((result)=>{
                        var addItem = groupMap(result.data.ProductGroup);
                        vm.items.push(addItem)
                        vm.offset = vm.items.length;
                        setSelectedItem(addItem);
                    });
            }
        }

        function setSelectedItem(item){
            vm.selectionModel = item;
        }

        function groupMap(item) {
            return {
                uniqueId: item.UniqueId,
                displayName: `${item.InternalCode} - ${item.Description}`,
                internalCode: item.InternalCode,
                description: item.Description,
            };
        }

        $scope.$on(`notifySetProductGroup_${vm.name}`, function(event, groupId){
            vm.selectedKey = groupId;
        });
    }
})();