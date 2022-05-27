
(function () {
	'use strict';

	angular
		.module('custom')
		.controller('userDialogController', userDialogController)

	userDialogController.$inject = ['$scope', 'ngDialog', 'user'];
	function userDialogController($scope, ngDialog, user) {

		$scope.user = user;
	}
})();
