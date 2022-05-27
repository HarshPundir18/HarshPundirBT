(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-group/select-group.html',
        controller: 'SelectGroupController',
        controllerAs: 'vm',
        bindings: {
            name: '@',
            labelText: '@',
            selectionModel: '=',
            onChange: '&',
            selecttionGroup: '=',
            selectedKey: '<',
            isDisabled: '='
        }
    };
    
    angular
        .module('custom')
        .component('smgSelectGroup', component);

    angular
        .module('custom')
        .controller('SelectGroupController', SelectGroupController);

    SelectGroupController.$inject = ['$scope', '$filter', 'garsService'];
    function SelectGroupController($scope, $filter, garsService) {
        var vm = this;
        vm.groups = garsService.groups();

        vm.onSelectGroupChange = function(){
            //console.log('Component onChange: ' + vm.selectionModel);
            if(vm.onChange) {
                vm.onChange({obj: vm.selectionModel});
            }
        }

        $scope.$watch('vm.selectedKey', function(newVal, oldVal) {
            if(newVal){
                var filtered = $filter('filter')(vm.groups, { 'key': newVal });
                if(filtered && filtered[0]){
                    vm.selectionModel = filtered[0];
                }
            }
        });
                
    }
})();