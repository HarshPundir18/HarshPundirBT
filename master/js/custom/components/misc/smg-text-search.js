   (function () {
    'use strict';
        
    var component = {
            templateUrl: '/app/custom/components/misc/smg-text-search.html',
            controller: 'SmgTextSearchController',
            controllerAs: 'vm',
            bindings: {
                searchType:'<',
                inpName:'@',
                dialogHeader: '@',
                index:'<',
                model: '=',
                onSelection: '&',
            }
        };
    
    angular
        .module('custom')
        .component('smgTextSearch', component);

    angular
        .module('custom')
        .controller('SmgTextSearchController', SmgTextSearchController);

    SmgTextSearchController.$inject = ['$scope', 'ngDialog', 'spinnerService', 'SMG_TEXT_SEARCH_TYPES'];
    function SmgTextSearchController($scope, ngDialog, spinnerService, SMG_TEXT_SEARCH_TYPES) {
        var vm = this;
        
        // console.log('SmgTextSearchController');
        // console.log('type ' + vm.searchType)

        var template = getTemplate(vm.searchType);

        vm.onSearchClick = ()=>{
            var dialog = ngDialog.open({
                template: template,
                className: 'ngdialog-theme-default load-items',
                controller: 'SmgInputTextSearchControllerDialog as vm',
                preCloseCallback: preCloseCallback,        
                scope: $scope,
                resolve : {
                    inpName: function(){ return vm.inpName; },
                    search: function (){ return ''; },
                    header: function() { return vm.dialogHeader; }
                }
            });

            dialog.closePromise.then(function(result) {
                if(result.value){
                    vm.model = buildModel(result);
                    if(vm.onSelection){
                        vm.onSelection({
                            obj:{
                                index: vm.index,
                                resultValue: result.value
                            }
                        });
                    }
                }
            });
        }

        // vm.onSelectedItemChange = function (item) {
        //     debugger
        //     console.log(item);
        // }

        $scope.$on('ngDialog.opened', function (e, $dialog) {
            if($dialog.hasClass('load-items')){
                spinnerService.show('.ngdialog-content');
            }
        });

        $scope.$on(`fetchEstablishmentFinished_${vm.inpName}`, function(event, item){
            spinnerService.hide('.ngdialog-content');
        });

        $scope.$on(`fetchProductsFinished_${vm.inpName}`, function(event, item){
            spinnerService.hide('.ngdialog-content');
        });


        var preCloseCallback = (payload) =>{    
            if(payload){
                
            }

            return true;
        }

        var buildModel = (result)=>{
            if(result.value){
                return {
                    id: result.value.id,
                    name: result.value.name,
                    vat: result.value.vat,
                    apaCode: result.value.apaCode,
                    uniqueId: result.value.uniqueId
                }
            }
        } 

        function getTemplate (searchType) {
            switch (searchType){          
                case SMG_TEXT_SEARCH_TYPES.Establishments: 
                    return '/app/custom/components/misc/smg-text-search-establishments-dialog.html';
                case SMG_TEXT_SEARCH_TYPES.Tags:
                    return '/app/custom/components/misc/smg-text-search-productCode-dialog.html';
                default:
                    return '';
            }
        }
    }
})();