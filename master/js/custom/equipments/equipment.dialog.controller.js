(function() {
    'use strict';

    angular
        .module('custom')
        .controller('equipmentDialogController', equipmentDialogController)

    equipmentDialogController.$inject = ['$rootScope', 'ngDialog', 'spinnerService', 'equipmentService', 'equipment'];
    function equipmentDialogController($rootScope, ngDialog, spinnerService, equipmentService, equipment) {

        var vm = this;

        vm.equipment = equipment;
        vm.isValid = false;

        vm.saveAccess = function () {
            spinnerService.show('.ngdialog-content');
            equipmentService
                .saveAccess(vm.equipment.UniqueId, vm.equipment.Vat, vm.apaAccess)
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
            equipmentService
                .removeAccess(vm.equipment.UniqueId)
                .then(function (result) {
                    $rootScope.$broadcast('removeAccessSuccess');
                    ngDialog.close();
                })
                .catch(function (error) {
                    if(vm.equipment.IsDefault){
                        vm.cannotRemoveAccess = true;
                    }
                });
        }
    }
})();