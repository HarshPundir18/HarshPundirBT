(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-pickupPoint/select-pickupPoint.html',
        controller: 'SelectPickupPointController',
        controllerAs: 'vm',
        transclude: true,
        bindings: {
            name: '@',
            labelText: '@',
            pickupPointType: '<',
            selectionModel: '=',
            selectedKey: '<',
            onChange: '&'
        }
    };

    angular
        .module('custom')
        .component('smgSelectPickupPoint', component);

    angular
        .module('custom')
        .controller('SelectPickupPointController', SelectPickupPointController);

    SelectPickupPointController.$inject = ['$element', '$filter', '$scope', 'spinnerService', 'pickupPointsService'];
    function SelectPickupPointController($element, $filter, $scope, spinnerService, pickupPointsService) {
        var vm = this;
        vm.isLoadingFirstTime = false;
        vm.items = [];
        vm.offset = 0;
        vm.pageSize = 200;
        vm.previousSearch = '';

        vm.onSelectChange = function(){
            //console.log('Component onChange');
            if(vm.onChange) {
                vm.onChange({obj: vm.selectionModel});
            }
        }

        vm.fetch = function($select, $event){
            if(vm.isLoadingFirstTime){
                spinnerService.show('.select-pickup-point');
            }
            
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
            vm.isLoading = true;
            
            pickupPointsService
                .getSelectPickupPoint(vm.pickupPointType, vm.offset, vm.pageSize, $select.search)
                .then(function (result) {
                    var items = result.data;
                    if(items && items.length === 0){
                        return;
                    }

                    var newItems = items.map((item)=>{ 
                        return  pickupPointMap(item);
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
                    vm.isLoading = false;
                    vm.previousSearch = $select.search;
                    $scope.$emit(`fetchPickupPointFinished_${vm.name}`);  
                     
                    spinnerService.hide('.select-pickup-point');       
                });
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
                pickupPointsService
                    .getPickupPoint(uniqueId)
                    .then((result)=>{
                        var addItem = pickupPointMap(result.data);
                        vm.items.unshift(addItem)
                        vm.offset = vm.items.length;
                        vm.selectionModel = addItem;
                    });
            }
        }
        
        function pickupPointMap(item){
            return { 
                id: item.Id,
                uniqueId: item.UniqueId,
                internalCode: item.InternalCode ,
                description: item.Description,
                displayName: `${item.InternalCode} - ${item.Description}`
            };            
        }
    }
})();