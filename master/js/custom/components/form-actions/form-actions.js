(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/form-actions/form-actions.html',
        controller: 'FormActionsComponentController as $ctrl',
        bindings: {
            showMandatoryFieldsMessage: '<',
            backButtonText: '@',
            saveButtonText: '@',
            onBackClick: '&?',
            onSaveClick: '&?',
        },

    };

    angular
        .module('custom')
        .component('smgFormActions', component);

    angular
        .module('custom')
        .controller('FormActionsComponentController', FormActionsComponentController);

    function FormActionsComponentController($scope, garsService) {
        var vm = this;

        vm.saveButtonText = vm.saveButtonText ? vm.saveButtonText : 'Gravar';
        vm.backButtonText = vm.backButtonText ? vm.backButtonText : 'Voltar';

        vm.options = vm.optionsSource; 

        vm.showBackButton = vm.onBackClick != undefined;
        vm.showSaveButton = vm.onSaveClick != undefined;

        vm.onSelectionChange = function(){
            vm.onChange({selected: vm.selectedOption});
        }

        vm.onBackActionClick = function(){
            vm.onBackClick();
        }

        vm.onSaveActionClick = function(){
            if(vm.onSaveClick){
                vm.onSaveClick();
            }
        }
    }
})();