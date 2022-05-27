(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-onuNumber/select-onuNumber.html',
        controller: 'SelectOnuNumberController',
        controllerAs: 'vm',
        bindings: {
            labelText: '@',
            selectionModel: '=',
            selectedKey: '<',
            onChange: '&'
        }
    };

    angular
        .module('custom')
        .component('smgSelectOnuNumber', component);

    angular
        .module('custom')
        .controller('SelectOnuNumberController', SelectOnuNumberController);

    SelectOnuNumberController.$inject = ['$filter', '$scope', 'onuNumbersService'];
    function SelectOnuNumberController($filter, $scope, onuNumbersService) {
        var vm = this;
        $scope.items = [];
        $scope.page = 0;
        $scope.pageSize = 200;

        vm.onOnuNumberChange = function(){
            if(vm.onChange) {
                vm.onChange({obj: vm.selectionModel});
            }
        }

        $scope.fetch = function fetch($select, $event){
            // no event means first load!
            if (!$event) {
                
            } else {
                $event.stopPropagation();
                $event.preventDefault();
                $scope.page ++;
            }

            if(!$scope.allItems){
                onuNumbersService.onuNumbers()
                .then(function (result) {
                    $scope.allItems = result.data.map(function(item) {
                        return { 
                            code: item.Code,
                            description: item.Description,
                        };
                    });

                    addPage($select.search);
                });
            }else{
                addPage($select.search);
            }
        }

        function addPage(search){
            var page = null;
            
            //if it is duplicating egar then vm.setSelectionModel is not null
            if(vm.selectedKey){
                page = paginate($scope.allItems, $scope.pageSize, $scope.page, vm.selectedKey);
                vm.selectionModel = page[0];

                //set to null just to prevent doing this again
                vm.selectedKey = null;
            }else{
                page = paginate($scope.allItems, $scope.pageSize, $scope.page, search);
            }

            
            if($scope.page == 0){
                $scope.items = page;
            }else{
                $scope.items = $scope.items.concat(page);
            }
        }

        function paginate (array, pageSize, pageNumber, search) {
            var array = [];
            if(search){
                $scope.page = 0;
                array = $filter('filter')($scope.allItems, function (item) { return item.code.toLowerCase().indexOf(search.toLowerCase()) >= 0; });
            }else{
                array = $scope.allItems;
            }

            //because pages logically start with 1, but technically with 0
            if(array && array.length > 0){
                return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
            }else{
                return array;
            }
        }

        $scope.$on('notifySetOnuNumber', function(event, item){
            console.log('notifySetOnuNumber');
        });

        $scope.$on('notifyClearOnuNumber', function(event, item){
            vm.selectionModel = null;
        });

    }
})();