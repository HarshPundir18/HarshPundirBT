(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-user/select-user.html',
        controller: 'SelectUserController',
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
        .component('smgSelectUser', component);

    angular
        .module('custom')
        .controller('SelectUserController', SelectUserController);

    SelectUserController.$inject = ['$element', '$scope', '$filter', 'spinnerService', 'userService'];
    function SelectUserController($element, $scope, $filter, spinnerService, userService) {
        var vm = this;
        $scope.items = [];
        vm.offset = 0;
        vm.pageSize = 200;
        vm.previousSearch = '';

        vm.displayInputText = vm.displayText ? vm.displayText :  'Pesquisar Utilizador...';

        vm.$onInit = function(){

        }

        vm.onSelectChange = function(){
            //console.log('Component onChange');
            if(vm.onChange) {
                vm.onChange({obj: vm.selectionModel});
            }
        }

        $scope.fetch = function($select, $event){
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
  
            userService
                .getSelectUsersV2(vm.offset, vm.pageSize, $select.search)
                .then((result)=>{
                    if(result.data){
                        var items = result.data;   
             
                        var newItems = items.map((item)=>userMap(item));
                        if(vm.offset === 0){
                            vm.items = newItems;
                        }else{
                            vm.items = vm.items.concat(newItems);
                        }
                        ensureSelectedKeyIsThere(vm.selectModelKey);
                        vm.offset += items.length;
                    }
                })
                .finally(function(){
                    spinnerService.hide(elem);   
                    vm.previousSearch = $select.search;
                    $scope.$emit(`fetchUserFinished_${vm.name}`);          
                });
        }

        function ensureSelectedKeyIsThere(key){
            if(!key || key.length <= 0){
                return;
            }
            var filtered = $filter('filter')(vm.items, { 'key': key });
            if(filtered && filtered[0]){
                setSelectedItem(filtered[0]);
            }else{
                userService
                    .getUser(key)
                    .then((result)=>{
                        var addItem = userMap(result.data);
                        vm.items.push(addItem)
                        vm.offset = vm.items.length;
                        setSelectedItem(addItem);
                    });
            }
        }

        function setSelectedItem(item){
            vm.selectionModel = item;
        }

        function userMap(item) {
            return { 
                key: item.UniqueId,
                value: item.Email,
                id: item.Id
            };
        }

        $scope.$on(`notifySetUser_${vm.name}`, function(event, item){
            vm.selectModelKey = item;
        });
    }
})();