(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/select-establishment/select-establishment.html',
        controller: 'SelectEstablishmentController',
        controllerAs: 'vm',
        bindings: {
            name: '@',
            labelText: '@',
            selectionModel: '=',
            selectedKey: '<',
            onChange: '&',
            type: '<'
        }
    };

    angular
        .module('custom')
        .component('smgSelectEstablishment', component);

    angular
        .module('custom')
        .controller('SelectEstablishmentController', SelectEstablishmentController);

    SelectEstablishmentController.$inject = ['$element', '$scope', '$filter', 'spinnerService', 'establishmentService', 'SMG_ESTABLISHMENT_TYPES'];
    function SelectEstablishmentController($element, $scope, $filter, spinnerService, establishmentService, SMG_ESTABLISHMENT_TYPES) {
        var vm = this;
        vm.items = [];
        vm.offset = 0;
        vm.pageSize = 200;
        vm.previousSearch = '';

        if(!vm.type){
            vm.type = SMG_ESTABLISHMENT_TYPES.ALL;
        }

        vm.onSelectChange = function(){
            console.log('Component onChange');
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

            var elem = $element.find('.select-establishment-load-more');
            spinnerService.show(elem);
            establishmentService
                .getAvailableEstablishmentsV2(vm.offset, vm.pageSize, $select.search, vm.type)
                .then(function (result) {
                    var items = result.data;
                    
                    if(items.length === 0){
                        return;
                    }

                    vm.canLoadMore = items.length >= 200;                  

                    var newItems = items.map(function(item) {
                        if(item.Type == 1){
                            //account estab.
                            tooltip = 'O meu Estabelecimento';
                        }else if(item.Type == 2){
                            //account client estab
                            tooltip = item.HasApaAccess ? 'Estabelecimento Cliente com acesso Siliamb' :  'Estabelecimento Cliente';
                        }
                        
                        return establishmentMap(item);
                    });

                    if(vm.offset === 0){
                        vm.items = newItems;
                    }else{
                        vm.items = vm.items.concat(newItems);
                    }

                    ensureSelectedKeyIsThere(vm.selectedKey);

                    vm.offset += items.length;
                })
                .finally(function(){     
                    spinnerService.hide(elem);   
                    vm.previousSearch = $select.search;
                    $scope.$emit(`fetchEstablishmentFinished_${vm.name}`);          
                });
        }

        function ensureSelectedKeyIsThere(uniqueId){
            if(!uniqueId || uniqueId.length <= 0){
                return;
            }

            var filtered = $filter('filter')(vm.items, { 'uniqueId': uniqueId });
            if(filtered && filtered[0]){
                //set the item
                vm.selectionModel = filtered[0];
            }else{
                establishmentService
                    .getEstablishment(uniqueId)
                    .then((result)=>{
                        var addItem = establishmentMap(result.data);
                        vm.items.unshift(addItem)
                        vm.offset = vm.items.length;
                        vm.selectionModel = addItem;
                    });
            }
        }

        function establishmentMap(item){
            return { 
                id: item.Id,
                uniqueId: item.UniqueId,
                name: item.Name ,
                apaCode: item.ApaCode,
                vat: item.Vat,
                address: item.Address.DisplayAddress,
                street: item.Address.Street,
                city: item.Address.City,
                postalCode: item.Address.PostalCode,
                local: item.Address.Local,
                type: item.IsDefault ? 1 : 2,
                HasApaAccess: item.HasApaAccessConfigured
            };     
        }
    }
})();