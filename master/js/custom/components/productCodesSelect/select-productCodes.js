(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-productCodes/select-productCodes.html',
        controller: 'SelectProductCodeController',
        controllerAs: 'vm',
        bindings: {
            name: '@',
            labelText: '@',
            selectionModel: '=',
            onChange: '&'
        }
    };

    angular
        .module('custom')
        .component('smgSelectProductCode', component);

    angular
        .module('custom')
        .controller('SelectProductCodeController', SelectProductCodeController);

    SelectProductCodeController.$inject = ['$element', '$scope', 'spinnerService', 'productCodesService'];
    function SelectProductCodeController($element, $scope, spinnerService, productCodesService) {
        
        const pageSize = 200;

        var vm = this;
        vm.items = [];
        vm.offset = 0;
        vm.previousSearch = '';

        vm.onProductCodeChange = function(){
            if(vm.onChange) {
                vm.onChange({obj: vm.selectionModel});
            }
        }

        vm.fetch = function getPeriods($select, $event){
            // no event means first load!
            if (!$event) {
                //vm.items = [];
            } else {
                $event.stopPropagation();
                $event.preventDefault();
                vm.page++;
            }

            if(vm.previousSearch != $select.search){
                vm.offset = 0;
            }

            var elem = $element.find('.select-product-load-more');
            spinnerService.show(elem);

            productCodesService
                .getSelectProducts(vm.offset, pageSize, $select.search)
                .then(function (result) {
                    var items = result.data;
                    if(items && items.length === 0){
                        return;
                    }

                    var newItems = items.map(function(item) {
                        return { 
                            uniqueId: item.UniqueId,
                            displayName: `${item.InternalCode} - ${item.Description}`,
                            internalCode: item.InternalCode,
                            description: item.Description,
                            id: item.Id,
                        };
                    });

                    if(vm.offset === 0){
                        vm.items = newItems;
                    }else{
                        vm.items = vm.items.concat(newItems);
                    }

                    vm.offset += items.length;

                    vm.hideLoadingMore = items.length < pageSize;
                })
                .finally(function(){
                    spinnerService.hide(elem);   
                    vm.previousSearch = $select.search;
                    $scope.$emit(`fetchProductsFinished_${vm.name}`);  

                });
        }

        $scope.$on('notifySetProduct', function(event, item){
            var selected = {
                uniqueId: item.UniqueId,
                displayName: `${item.InternalCode} - ${item.Description}`,
                internalCode: item.InternalCode,
                description: item.Description,
            }

            vm.selectionModel = selected;

            //$scope.items = $scope.items.concat([selected]);
        });

        $scope.$on('notifyClearProduct', function(event, item){
            vm.selectionModel = null;
        });

    }
})();