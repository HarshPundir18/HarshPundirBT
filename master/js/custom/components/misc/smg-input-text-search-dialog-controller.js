   (function () {
    'use strict';

    angular
        .module('custom')
        .controller('SmgInputTextSearchControllerDialog', SmgInputTextSearchControllerDialog)

    SmgInputTextSearchControllerDialog.$inject = ['$element', '$scope', 'ngDialog', 'inpName', 'search', 'header', 'spinnerService'];
    function SmgInputTextSearchControllerDialog($element, $scope, ngDialog, inpName, search, header, spinnerService) {
        
        var vm = this;

        vm.search = search;
        vm.header = header;
        vm.inpName = inpName;

        vm.onSelectedItemChange=(obj)=>{
            console.log(obj)
        }

    }
})();