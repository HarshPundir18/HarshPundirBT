
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garsBatchAcceptRectificationCreateController', garsBatchAcceptRectificationCreateController);

        garsBatchAcceptRectificationCreateController.$inject = ['$window', '$state', '$log', '$compile', '$scope',
        'SMG_TEXT_SEARCH_TYPES',
        'spinnerService', 'egarBatchService', 'translationService', 'utilsService'];
    function garsBatchAcceptRectificationCreateController($window, $state, $log, $compile, $scope,
        SMG_TEXT_SEARCH_TYPES,
        spinnerService, egarBatchService, translationService, utilsService) {

        var vm = this;
        vm.loading = false;
        vm.loadingSelector = '#batch-accept-rectification-create';
        vm.items = [];
        vm.totalItemsCount = 0;
        
        vm.SMG_TEXT_SEARCH_TYPES = SMG_TEXT_SEARCH_TYPES;

        vm.translate = (key)=>{ return translationService.translate(key); }

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

            spinnerService.show(vm.loadingSelector);

            egarBatchService.createEgarAcceptanceBatch(egars)
                .then((result)=>{
                    $state.go('app.batchAcceptanceList');
                    utilsService.notifySuccess('Lote criado com sucesso!');
                })
                .catch((error)=>{
                    utilsService.notifyError('Não foi possível efectuar a operação. <br> Se o problema persistir, por favor contacte o suporte.');
                })
                .finally(()=>{
                    spinnerService.hide(vm.loadingSelector);
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

        vm.onSelectedDestin = (obj) =>{
            if(obj && obj.resultValue){
                vm.destinText = obj.resultValue.name;
            }           
        }
        

        // vm.onSelectedProductCodeChange = (obj) =>{
        //     if(obj && obj.resultValue){
        //         vm.tagText = obj.resultValue.name;
        //     }
        // }
        
        vm.formatRectification = (oldValue, newValue)=>{
            if(newValue){
                return `
                <span class="smg-rectification-old-value">${oldValue}</span>
                <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                <span class="smg-rectification-new-value">${newValue}</span>
                `;
            }
            
            return oldValue;
        }

        activate();

        ////////////////
        function activate() {
            spinnerService.show(vm.loadingSelector);
        
            var destinId = vm.selectedEstablishment ? vm.selectedEstablishment.id : null;
            var tagId = vm.selectedProductCode ? vm.selectedProductCode.id : null;
  
            egarBatchService
                .getEgarForAcceptRectificationBatch(vm.items.length, vm.egarDate, destinId, tagId)
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
                            rectifiedLerCode: item.ResiduoTransportadoCorrigido.CodigoResiduoLerCorrigido,
                            operationCode: item.ResiduoTransportado.CodigoOperacao,
                            rectifiedOperationCode: item.ResiduoTransportadoCorrigido.CodigoOperacaoCorrigido,
                            weight: item.ResiduoTransportado.Quantidade,
                            rectifiedWeight: item.ResiduoTransportadoCorrigido.QuantidadeCorrigido,
                            rectificationComment: item.ResiduoTransportadoCorrigido.ComentarioDestinatario,
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
                    spinnerService.hide(vm.loadingSelector);
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
