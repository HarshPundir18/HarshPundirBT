
(function () {
	'use strict';

	angular
		.module('custom')
		.controller('ServiceAreaDialogController', ServiceAreaDialogController)

    ServiceAreaDialogController.$inject = ['$scope', 'ngDialog', 'serviceArea'];
	function ServiceAreaDialogController($scope, ngDialog, serviceArea) {
        var vm = this;
        vm.serviceArea = serviceArea;
	}
})();
