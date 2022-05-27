
   


   (function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/misc/smg-select.html',
        controller: 'SmgSelectController',
        controllerAs: 'vm',
        bindings: {
            name:'<',
            labelText: '@',
            hideLabelText: '<',
            items: '=',
            isLoading: '=',
            selectedItem: '=',
            onChangeFunc: '&',
            onLoadMoreFunc: '&',
            canLoadMore: '<',
            onSearchFunc: '&'
        }
    };

    angular
        .module('custom')
        .component('smgSelect', component);

    angular
        .module('custom')
        .controller('SmgSelectController', SmgSelectController);

    SmgSelectController.$inject = ['$element', '$scope'];
    function SmgSelectController($element, $scope) {
        var vm = this;

        if(vm.hideLabelText)
        {
            vm.placeholder = '';    
        }else{
            if(vm.labelText){
                vm.placeholder = vm.labelText;
            }else{
                vm.placeholder = 'Pesquisar...';
            }
        }

        
        vm.onSelectChange = function(){
            //console.log('onSmgSelectChange')
            if(vm.onChangeFunc) {
                vm.onChangeFunc({obj: vm.selectedItem});
            }
        }

        vm.onSearch = function(select){
            //console.log('onSmgSearch');
            if(vm.onSearchFunc){
                vm.onSearchFunc({obj: select});
            }
        }

        vm.onLoadMoreClick = function($select, $event){
            
            if(vm.onLoadMoreFunc) {
                vm.onLoadMoreFunc({obj: vm.selectedItem});
            }
        }
        
        var setEventName = `set${vm.name}`;
        $scope.$on(setEventName, function(event, item){
            console.log(setEventName);
        });

        var clearEventName = `clear${vm.name}`;
        $scope.$on(clearEventName, function(event, item){
            console.log(clearEventName);
        });
    }
})();