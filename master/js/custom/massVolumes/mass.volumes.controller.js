(function() {
    'use strict';

    angular
        .module('custom')
        .controller('massVolumesController', massVolumesController);

        massVolumesController.$inject = ['$scope', '$filter', '$state', '$stateParams',
                                    'massVolumesService', 'spinnerService', 'translationService', 'utilsService', 'dateService'];
    function massVolumesController($scope, $filter, $state, $stateParams,
                                    massVolumesService, spinnerService, translationService, utilsService, dateService) {
        
        //VM stuff
        var vm = this;
        vm.massVolumes = [];
        vm.year = $stateParams.year;

        dateService.changeLocalePt();

        vm.translate = function(key) {
            return translationService.translate(key);
        }

        vm.massVolumes = massVolumesService.getMassVolumes(vm.year)
        .then((result)=>{
            if(result.data.IsSuccess){
                
                vm.nextUpdate = result.data.NextUpdate;

                if(result.data.MassVolumeGroups.length === 0){
                    vm.showNoResults = true;
                }
                else {
                    var massVolumes = result.data.MassVolumeGroups;
                    var array = [];
                    //organize first show aggregated by ApaCode, then by Vat
                    var byApaCode = ($filter)('filter')(massVolumes, (item) => { return !item.AggregatedByVat; });
                    var byVat = $filter('filter')(massVolumes, (item) => { return item.AggregatedByVat; });
    
                    array = array.concat(byApaCode).concat(byVat);
    
                    var matrix = utilsService.arrayToMatrix(array, 2);
                    vm.massVolumes = matrix;
                    vm.showResults = true;
                }  
            }
        })
        .catch((error) => {

        })
        .finally((spinnerService.hide('#div-results')));
    }
})();