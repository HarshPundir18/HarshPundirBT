(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garsArchiveController', garsArchiveController);

    garsArchiveController.$inject = ['$window', '$rootScope', '$scope', '$compile', '$http', '$state', '$stateParams', '$filter',
                                    'establishmentService', 'spinnerService', 'translationService', 'utilsService', 'ngDialog'];
    function garsArchiveController($window, $rootScope, $scope, $compile, $http, $state, $stateParams, $filter,
                                    establishmentService, spinnerService, translationService, utilsService, ngDialog) {
  
        //VM stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];

        vm.year = $stateParams.year;

        vm.allRows = [];

        //test data
        vm.rawItems = [
            {Name: 'a', UniqueId: 1},
            {Name: 'b', UniqueId: 2},
            {Name: 'c', UniqueId: 3},
            {Name: 'd', UniqueId: 4},
            {Name: 'e', UniqueId: 5},
            {Name: 'f', UniqueId: 6},
            {Name: 'g', UniqueId: 7},
            {Name: 'h', UniqueId: 8},
            {Name: 'i', UniqueId: 9},
            {Name: 'j', UniqueId: 10},
            {Name: 'k', UniqueId: 11}
        ]

        vm.$onInit = function() {
            establishmentService
                .getAllowedClientEstablishments()
                .then(getAllowedClientEstablishmentsOnSuccess)
                .catch(getAllowedClientEstablishmentsOnError);
        }

        //CALLBACKS
        function getAllowedClientEstablishmentsOnSuccess(result) {
            prepareData(result.data);
        }

        function getAllowedClientEstablishmentsOnError(error) { }


        //PRIVATES
        function prepareData(data) {
            var dataArray = data;
            var itemsPerRow = 6;
            var length = dataArray.length;
            var numberOfRows = 0;
            
            if((length % itemsPerRow) > 0) {
                numberOfRows = Math.floor(length / itemsPerRow) + 1;
            } else {
                numberOfRows = Math.floor(length / itemsPerRow);
            }

            var counter = 0;
            var allRows = [];
            for(var i = 0; i < numberOfRows; i++){
                var row = {};
                row.index = i;
                row.establishments = [];
                
                for(var j = 0; j < itemsPerRow; j++) {
                    if(dataArray[counter] !== undefined) {
                        row.establishments.push(dataArray[counter]);
                        counter ++;
                    }                   
                }

                allRows.push(row);
            }
            vm.allRows = allRows;
        }


        vm.downloadArchive = function(establishment){
            ngDialog.open({
                template: '/app/custom/garsArchive/dialog.download.gar.archive.html',
                className: 'ngdialog-theme-default',
                controller: 'dialogGarsArchiveController as vm',
                resolve : {
                    establishment:  () => { return establishment; },
                    year: () => { return vm.year }
                },
                preCloseCallback: preClose,
                width: 400,
                showClose: true,
                closeByNavigation: true,
            });
        }

        function preClose(result) {
            if(result === true){
                utilsService.notifySuccess('O pedido foi registado. <br> Entraremos em contacto o mais brevemente possível.');
            } else if (result === false) {
                utilsService.notifyError('Não foi possível registar o pedido. Se o erro continuar por favor contacte o suporte.');
            }
        }

        //SCOPE stuff
    }
})();