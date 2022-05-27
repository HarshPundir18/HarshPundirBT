(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-ler/select-ler.html',
        controller: 'SelectLerController',
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
        .component('smgSelectLer', component);

    angular
        .module('custom')
        .controller('SelectLerController', SelectLerController);

    SelectLerController.$inject = ['$element', '$scope', '$filter', 'spinnerService', 'garsService'];
    function SelectLerController($element, $scope, $filter, spinnerService, garsService) {
        var vm = this;
        vm.offset = 0;
        vm.pageSize = 200;
        vm.lerCodes = [];
        

        vm.onSelectLerChange = function(){
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
            garsService.lerCodesPage(vm.offset, vm.pageSize, $select.search)
                .then(function (result) {
                    var items = result;
                    if(items && items.length === 0){
                        return;
                    }

                    var newItems = items.map(function(item) {
                        return lerMap(item);
                    });

                    if(vm.offset === 0){
                        vm.lerCodes = newItems;
                    }else{
                        vm.lerCodes = vm.lerCodes.concat(newItems);
                    }

                    vm.offset += items.length;
                })
                .finally(function(){     
                    spinnerService.hide(elem);   
                    vm.previousSearch = $select.search;
                    $scope.$emit(`fetchLerFinished_${vm.name}`);          
                });
        }

        function ensureSelectedKeyIsThere(uniqueId){
            if(!uniqueId || uniqueId.length <= 0){
                return;
            }

            var filtered = $filter('filter')(vm.lerCodes, { 'key': uniqueId });
            if(filtered && filtered[0]){
                //set the item
                vm.selectionModel = filtered[0];
            }else{
                garsService.getLerCode(uniqueId)
                    .then((result)=>{
                        var addItem = lerMap(result);
                        vm.lerCodes.unshift(addItem)
                        vm.offset = vm.lerCodes.length;
                        vm.selectionModel = addItem;
                    });
            }
        }

        function lerMap(item){
            return { 
                key: item.key,
                value: item.value
            };
        }

        $scope.$watch('vm.selectedKey', function(newVal, oldVal) {
            if(newVal){
                ensureSelectedKeyIsThere(newVal);
            }
        });

    }
})();