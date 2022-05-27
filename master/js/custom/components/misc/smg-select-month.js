(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/misc/smg-select-month.html',
        controller: 'SelectMonthController',
        controllerAs: 'vm',
        bindings: {
            name: '@',
            labelText: '@',
            displayText: '@',
            selectionModel: '=',
            onChange: '&'
        }
    };

    angular
        .module('custom')
        .component('smgSelectMonth', component);

    angular
        .module('custom')
        .controller('SelectMonthController', SelectMonthController);

        SelectMonthController.$inject = ['$scope', 'translationService'];
    function SelectMonthController($scope, translationService) {
        var vm = this;
        vm.items = [];
        vm.offset = 0;
        vm.previousSearch = '';

        vm.displayInputText = vm.displayText ? vm.displayText :  'Pesquisar mês...';

        vm.$onInit = function(){


            for(var i=0; i<9; i++){
                var startDate = new Date();
                startDate.setMonth(startDate.getMonth() - i);

                var year = startDate.getFullYear();
                var month = startDate.getMonth() + 1; //bc in js month are -1 (ex: january: 0, february: 1....)

                vm.items.push({
                    key: startDate,
                    value: `${translationService.translateDateStuff(month)} (${year})`,
                    month: month,
                    year: year
                })
            }
        }

        vm.onSelectChange = function(){
            //console.log('Component onChange');
            if(vm.onChange) {
                vm.onChange({obj: vm.selectionModel});
            }
        }


        $scope.$on(`notifySetMont_${vm.name}`, function(event, item){
            vm.selectModelKey = item;
        });
    }
})();