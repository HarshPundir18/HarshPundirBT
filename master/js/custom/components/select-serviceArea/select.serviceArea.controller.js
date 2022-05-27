(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-serviceArea/select-serviceArea.html',
        controller: 'SelectServiceAreaController',
        controllerAs: 'vm',
        bindings: {
            name: '@',
            labelText: '@',
            selectionModel: '=',
            selectedKey: '<',
            onChange: '&',
            keyInternalCode:'<'
        }
    };
    
    angular
        .module('custom')
        .component('smgSelectServiceArea', component);

    angular
        .module('custom')
        .controller('SelectServiceAreaController', SelectServiceAreaController);

    SelectServiceAreaController.$inject = ['$element', '$scope', '$filter', 'spinnerService', 'serviceAreaService'];
    function SelectServiceAreaController($element, $scope, $filter, spinnerService, serviceAreaService) {
        var vm = this;
        vm.items = [];
        vm.offset = 0;
        vm.pageSize = 200;
        vm.previousSearch = '';

        vm.$onInit = function(){
            
        }

        vm.onSelectChange = function(){
            //console.log('Component onChange');
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
            
            serviceAreaService
                .getSelectServiceAreas(vm.offset, vm.pageSize, $select.search)
                .then((result)=>{
                    if(result.data && result.data.aaData){
                        var items = result.data.aaData;
                        var newItems = items.map(function(item) {
                            return serviceAreaMap(item);
                        });
                        
                        if(vm.offset === 0){
                            vm.items = newItems;
                        }else{
                            vm.items = vm.items.concat(newItems);
                        }

                        ensureSelectedKeyIsThere(vm.selectedKey);
                        vm.offset += items.length;
                    }
                })
                .finally(function(){     
                    spinnerService.hide(elem);   
                    vm.previousSearch = $select.search;
                    $scope.$emit(`fetchServiceAreaFinished_${vm.name}`);          
                });;
        }

        function ensureSelectedKeyIsThere(uniqueId){
            if(!uniqueId || uniqueId.length <= 0){
                return;
            }

            var filtered = $filter('filter')(vm.items, { 'uniqueId': uniqueId });
            if(filtered && filtered[0]){
                //set the item
                vm.selectionModel = filtered[0];
            }else{
                serviceAreaService
                    .get(uniqueId)
                    .then((result)=>{
                        if(result.data.Items && result.data.Items.length > 0){
                            var addItem = serviceAreaMap(result.data.Items[0]);
                            vm.items.unshift(addItem)
                            vm.offset = vm.items.length;
                            vm.selectionModel = addItem;
                        }
                    });
            }
        }

        function serviceAreaMap(item){
            return { 
                key: vm.keyInternalCode ? item.InternalCode : item.UniqueId,
                value: `${item.InternalCode} - ${item.Description}`,
                assignedToUser: item.AssignedToUserName
            }
        }

        $scope.$on(`notifySetServiceArea_${vm.name}`, function(event, item){
            //TODO
        });
    }
})();