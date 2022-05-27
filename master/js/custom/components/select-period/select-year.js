(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-period/select-year.html',
        controller: 'SelectYearController',
        controllerAs: 'vm',
        bindings: {
            selectedKey: '<',
            selectedItem: '=',
            labelText: '@',
            onChange: '&'
        },
    };

    angular
        .module('custom')
        .component('smgSelectYear', component);

    angular
        .module('custom')
        .controller('SelectYearController', SelectYearController);

    function SelectYearController($filter, reportService, translationService) {

        var vm = this;
        vm.labelText = 'asdada'
        vm.items = [];
                
        buildItems();

        setSelectedItem();

        function setSelectedItem(){
            
            if(vm.selectedKey){
                vm.selectedItem = vm.items.find((item)=>{ 
                    return item.key == vm.selectedKey
                 });

            }else{
                vm.selectedItem = vm.items[vm.items.length - 1];
            }
        }

        function buildItems(){
            var startYear = 2018;
            var currentYear = new Date().getFullYear();

            for(var i=startYear; i<= currentYear; i++){
                var year = {
                    key: i,
                    value: i
                };
                vm.items.push(year);
            }
        }

        vm.onSelectionChange = function(){
            vm.onChange({selected: vm.selectedItem});
        }
    }
})();