(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-vehicle/select-vehicle.html',
        controller: 'SelectVehicleController',
        controllerAs: 'vm',
        bindings: {
            name: '@',
            labelText: '@',
            displayText: '@',
            selectModel: '=',
            selectModelKey: '<',
            onChange: '&'
        }
    };
    
    angular
        .module('custom')
        .component('smgSelectVehicle', component);

    angular
        .module('custom')
        .controller('SelectVehicleController', SelectVehicleController);

        SelectVehicleController.$inject = ['$element', '$scope', '$filter', 'spinnerService', 'vehiclesService'];
    function SelectVehicleController($element, $scope, $filter, spinnerService, vehiclesService) {
        var vm = this;
        $scope.items = [];
        vm.offset = 0;
        vm.pageSize = 200;
        vm.previousSearch = '';

        vm.displayInputText = vm.displayText ? vm.displayText :  'Pesquisar Veículo...';

        vm.$onInit = function(){

        }

        vm.onSelectChange = function(){
            //console.log('Component onChange');
            if(vm.onChange) {
                vm.onChange({obj: vm.selectModel});
            }
        }

        $scope.fetch = function($select, $event){
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
  
            vehiclesService.getSelectVehicles(vm.offset, vm.pageSize, $select.search)
                .then((result)=>{
                    if(result.data){
                        var items = result.data;   
             
                        var newItems = items.map((item)=>vehicleMap(item));

                        if(vm.offset === 0){
                            vm.items = newItems;
                        }else{
                            vm.items = vm.items.concat(newItems);
                        }
                        ensureSelectedKeyIsThere(vm.selectModelKey);
                        vm.offset += items.length;
                    }
                })
                .finally(function(){
                    spinnerService.hide(elem);   
                    vm.previousSearch = $select.search;
                    $scope.$emit(`fetchVehicleFinished_${vm.name}`);          
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
                vehiclesService
                    .get(key)
                    .then((result)=>{
                        var addItem = vehicleMap(result.data);
                        vm.items.push(addItem)
                        vm.offset = vm.items.length;
                        setSelectedItem(addItem);
                    });
            }
        }

        function setSelectedItem(item){
            vm.selectModel = item;
        }

        function vehicleMap(item) {
            return { 
                key: item.UniqueId,
                //value: item.UserLoginName,
                value: `${item.Registration} - ${item.Description}`,
            };
        }
    }
})();