
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('egarPdfController', egarPdfController);

    egarPdfController.$inject = ['$window', '$state', '$stateParams',
                                    'garsService', 'spinnerService', 'translationService', 'utilsService'];
    function egarPdfController($window, $state, $stateParams,
                                    garsService, spinnerService, translationService, utilsService) {
        
        //VM stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        vm.url = $stateParams.url;

        //
        activate();

        //CALLBACKS

        //PRIVATES
        function activate(){
            garsService
                .getEGarFile(url)
                .then(function (result){
                    //$window.open('data:application/pdf;base64,' + result.data, '_blank');                   
                })
                .catch(function errorCallback(result){
                    alert('Não foi possivel obter o documento!')
                })
                .finally(spinnerService.hide('.panel-body'));
        }

        //SCOPE stuff
    }
})();


