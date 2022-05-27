
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garsBatchAcceptanceCreateController', garsBatchAcceptanceCreateController);

    garsBatchAcceptanceCreateController.$inject = ['$window', '$state', '$log', '$compile', '$scope',
        'spinnerService', 'egarBatchService', 'translationService', 'utilsService'];
    function garsBatchAcceptanceCreateController($window, $state, $log, $compile, $scope,
        spinnerService, egarBatchService, translationService, utilsService) {

        var vm = this;
        vm.loading = false;
        vm.items = [];
        vm.totalItemsCount = 0;
        

        vm.onCheckAllClick = function(){
            vm.items.map(function(item) {
                item.isChecked = vm.allChecked;
            });
        }

        vm.onCheckClick = function(item){
        }

        vm.getFile = function(url){
            $window.open(url, '_blank');
        }

        vm.onLoadMoreClick = function(){
            activate();
        }
        
        vm.onCreateBatchClick = function(){
            var egars = getSelectedEgars();

            if(egars.length <= 0){
                utilsService.notifyWarning('Por favor selecione e-GARs.');
                return;
            }

            spinnerService.show('#main');

            egarBatchService.createEgarAcceptanceBatch(egars)
                .then((result)=>{
                    $state.go('app.batchAcceptanceList');
                    utilsService.notifySuccess('Lote criado com sucesso!');
                })
                .catch((error)=>{
                    utilsService.notifyError('Não foi possível efectuar a operação. <br> Se o problema persistir, por favor contacte o suporte.');
                })
                .finally(()=>{
                    spinnerService.hide('#main');
                });
        }

        vm.onSearchClick = function(){
            vm.items = [];
            activate();
        }

        vm.onClearFiltersClick = function(){
            vm.selectedServiceArea = null;
            vm.egarCreationDate = null;
            vm.selectedProductCode = null;
            vm.selectedUser = null;
            vm.onSearchClick();
        }

        vm.getFile = function(url){
            $window.open(url, '_blank');
        }

        vm.onSelectedProductCodeChange = function(product){
            console.log(product);
        }
        
        activate();

        ////////////////
        function activate() {
            spinnerService.show('#main');
            var serviceAreaCodeFilter = vm.selectedServiceArea ? vm.selectedServiceArea.key : null;
            var productCodeFilter = vm.selectedProductCode ? vm.selectedProductCode.id : null;
            var userFilter = vm.selectedUser ? vm.selectedUser.id : null;

            egarBatchService
                .getEgarForAcceptanceBatch(vm.items.length, vm.egarCreationDate, serviceAreaCodeFilter, userFilter, productCodeFilter)
                .then((result)=>{
                    result.data.aaData.map(function(item) {
                        var i = {
                            uniqueId: item.UniqueId,
                            number: item.NumeroGuia,
                            url: item.Url,
                            originName: item.Remetente.Nome,
                            originInternalId: '',
                            type: translationService.translate(item.CreationType),
                            lerCode: item.ResiduoTransportado.CodigoResiduoLer,
                            operationCode: item.ResiduoTransportado.CodigoOperacao,
                            weight: item.ResiduoTransportado.Quantidade,
                            serviceArea: '',
                            date: utilsService.formatDate(new Date(item.ReferenceDateUtc)),
                            destinName: item.Destinatario.Nome,
                            serviceAreaCode: item.ServiceAreaCode,
                            productTags: item.Products ? item.Products : []
                        };
                        vm.items.push(i);
                    });

                    //set firts time it loads
                    if(vm.totalItemsCount == 0){
                        vm.totalItemsCount = result.data.iTotalRecords;
                    }
                    
                    disableLoadMore();
                })
                .catch((error)=>{

                })
                .finally(()=>{
                    spinnerService.hide('#main');
                    vm.loading = true;
                });
        }

        function getSelectedEgars(){
            var array = [];
            vm.items.map((item)=>{
                if(item.isChecked){
                    array.push(item.uniqueId);
                }
            })
            return array;
        }

        function disableLoadMore(){
            vm.disableLoadMore = vm.items.length >= 500 || (vm.totalItemsCount != 0 && vm.items.length >= vm.totalItemsCount);
        }

        
        $scope.$watch('vm.egarCreationDate', function(newVal, oldVal){

        })
    }
})();
