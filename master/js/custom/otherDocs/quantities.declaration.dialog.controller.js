(function() {
    'use strict';

    angular
        .module('custom')
        .controller('QuantitiesDeclarationDialogController', QuantitiesDeclarationDialogController);

        QuantitiesDeclarationDialogController.$inject = ['SMG_QUANTITIES_DECLARATION_TYPES', 'SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES', 'dateService', 'data'];
    function QuantitiesDeclarationDialogController(SMG_QUANTITIES_DECLARATION_TYPES, SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES, dateService, data) {
        var vm = this;

        vm.startDate = dateService.toFormatedString(data.StartDate);
        vm.endDate =  dateService.toFormatedString(data.EndDate);


        if(data.Type == SMG_QUANTITIES_DECLARATION_TYPES.ExSitu){
            if(data.EmissionType == SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.AllEstablishments){
                vm.confirmMessage = `, para todos os estabelecimentos configurados como pontos de recolha EX-SITU`;
            } else if (data.EmissionType == SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.AllEstablishmentsWithVat){
                vm.confirmMessage = `, para todos os estabelecimentos configurados como pontos de recolha EX-SITU com o NIF `;
                vm.lastPart = data.establishment.vat;
            } else {
                vm.confirmMessage = `, o estabelecimento `;
                vm.lastPart = data.establishment.name;
            }
        } else if(data.Type == SMG_QUANTITIES_DECLARATION_TYPES.General){
            if (data.EmissionType == SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES.AllEstablishmentsWithVat){
                vm.confirmMessage = `, para todos os estabelecimentos com o NIF `;
                vm.lastPart = data.establishment.vat;
            } else {
                vm.confirmMessage = `, o estabelecimento `;
                vm.lastPart = data.establishment.name;
            }
        }
        else{
            throw 'data.Type no set';
        }
    
    }
})();