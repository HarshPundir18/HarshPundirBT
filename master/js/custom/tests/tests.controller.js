(function () {
    'use strict';

    angular
        .module('custom')
        .controller('testsController', testsController);

        testsController.$inject = ['$scope', '$compile', 'productCodesService'];
    function testsController($scope, $compile, productCodesService) {

        //VM stuff
        var vm = this;

        vm.msg="hello testsController";

        vm.dateDp1Name = 'dateDp1';
        vm.dateDp2Name = 'dateDp2';
        
        vm.selectEstablishmentName  = "selectEstablishmentName";
        vm.selectEstablishmentOnChange = function(){
            console.log('selectEstablishmentOnChange...');
        }

        $scope.$watch('vm.dateDp1', function () {
            console.log('vm.dateDp1 changed')
        });

        $scope.$watch('vm.dateDp2', function () {
            console.log('vm.dateDp2 changed')
        });

        $scope.$on(`datepickerControllerChanged${vm.dateDp1Name}`, function(event, obj){
            printResult(obj);
        });

        $scope.$on(`datepickerControllerChanged${vm.dateDp2Name}`, function(event, obj){
            printResult(obj);
        });


        vm.offset = 0;
        vm.pageSize = 5;
        vm.fetch = function (selectSearch, $event){
            // no event means first load!
            if (!$event) {
                //$scope.items = [];
            } else {
                $event.stopPropagation();
                $event.preventDefault();
                $scope.page++;
            }

            if(vm.previousSearch != selectSearch){
                vm.offset = 0;
            }

            productCodesService
                .getSelectProducts(vm.offset, vm.pageSize, selectSearch)
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
                        };
                    });

                    if(vm.offset === 0){
                        vm.items = newItems;
                    }else{
                        vm.items = vm.items.concat(newItems);
                    }

                    vm.offset += items.length;
                })
                .finally(function(){
                    vm.previousSearch = selectSearch;
                });

                vm.items = [{uniqueId: 1, displayName: '1'},{uniqueId: 2, displayName: '2'}];
        }

        vm.onChange = function(obj){
            console.log('Tests controller onChange');
        }

        vm.onLoadMore = function(){
            console.log('Tests controller onLoadMore');
        }

        vm.fetch();
    }
})();