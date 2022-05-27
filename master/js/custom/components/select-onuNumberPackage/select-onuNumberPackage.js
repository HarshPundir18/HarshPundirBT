(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-onuNumberPackage/select-onuNumberPackage.html',
        controller: 'SelectOnuNumberPackageController',
        controllerAs: 'vm',
        bindings: {
            labelText: '@',
            forOnuNumber: '=',
            selectionModel: '=',
            onChange: '&'
        }
    };

    angular
        .module('custom')
        .component('smgSelectOnuNumberPackage', component);

    angular
        .module('custom')
        .controller('SelectOnuNumberPackageController', SelectOnuNumberPackageController);

    SelectOnuNumberPackageController.$inject = ['$timeout', '$filter', '$scope', 'onuNumbersService'];
    function SelectOnuNumberPackageController($timeout, $filter, $scope, onuNumbersService) {
        var vm = this;
        vm.onuNumberPackageGroups = [
            { id: 'N/A', name: 'Não Aplicável' },
            { id: 'I', name: 'Group I' },
            { id: 'II', name: 'Group II' },
            { id: 'III', name: 'Group III' },
        ];

        vm.selectionModel = vm.selectionModel ? vm.selectionModel : 'N/A';

        vm.onOnuNumberPackageChange = function(){
            if(vm.onChange) {
                vm.onChange({obj: vm.selectionModel});
            }
        }

        
        $scope.$on('notifySetOnuNumberPackage', function(event, item){
            // debugger
            // var selected = {
            //     // uniqueId: item.UniqueId,
            //     // internalCode: item.InternalCode,
            //     // description: item.Description,
            // }

            // vm.selectionModel = selected;

            // $scope.items = $scope.items.concat([selected]);
        });

        $scope.$on('notifyClearOnuNumberPackage', function(event, item){
            vm.selectionModel = null;
        });

        // $scope.$watch('vm.forOnuNumber', function(newValue, oldValue){
        //     //debugger
        //     // vm.onuNumberPackageGroups = [
        //     //     { id: 'N/A', name: 'Não Aplicável' },
        //     //     { id: 'I', name: 'Group I' },
        //     //     { id: 'II', name: 'Group II' },
        //     //     { id: 'III', name: 'Group III' },
        //     // ];
        // });
    }
})();