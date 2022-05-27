
(function () {
    'use strict';

    angular
        .module('custom')
        .controller('establishmentDialogController', establishmentDialogController)

    establishmentDialogController.$inject = ['$rootScope', 'ngDialog', 'spinnerService', 'establishmentService', 'establishment'];
    function establishmentDialogController($rootScope, ngDialog, spinnerService, establishmentService, establishment) {

        var vm = this;

        vm.establishment = establishment;
        vm.isValid = false;

        vm.saveAccess = function () {
            spinnerService.show('.ngdialog-content');
            establishmentService
                .saveAccess(vm.establishment.UniqueId, vm.establishment.Vat, vm.apaAccess)
                .then(function (result) {
                    vm.accessInvalid = false;
                    $rootScope.$broadcast('saveAccessSuccess');
                    ngDialog.close();
                })
                .catch(function (error) {
                    vm.invalidAccess = true;
                })
                .finally(spinnerService.hide('.ngdialog-content'));
        }

        vm.removeAccess = function () {
            establishmentService
                .removeAccess(vm.establishment.UniqueId)
                .then(function (result) {
                    $rootScope.$broadcast('removeAccessSuccess');
                    ngDialog.close();
                })
                .catch(function (error) {
                    if(vm.establishment.IsDefault){
                        vm.cannotRemoveAccess = true;
                    }
                });
        }
    }
})();
