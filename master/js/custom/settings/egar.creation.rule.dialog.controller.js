
(function () {
	'use strict';

	angular
		.module('custom')
		.controller('EgarRulesDialogController', EgarRulesDialogController)

    EgarRulesDialogController.$inject = ['$scope', 'ngDialog', 'egarRule'];
	function EgarRulesDialogController($scope, ngDialog, egarRule) {
        var vm = this;
        vm.egarRule = egarRule;
	}
})();
