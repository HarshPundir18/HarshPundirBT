(function () {
	'use strict';

	angular
		.module('app.routes')
		.config(testsState);

    testsState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
	function testsState($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
            .state('app.testsEs6', {
				url: '/tests-es6',
				title: 'Relatórios',
				templateUrl: '/app/custom/tests/tests-es6.html',
				controller: 'Es6Controller',
				controllerAs: 'vm',
            })
            .state('app.tests', {
				url: '/test1',
				title: 'Relatórios',
				templateUrl: '/app/custom/tests/tests.html',
				controller: 'testsController',
				controllerAs: 'vm',
                resolve: helper.resolveFor('ngDialog','inputmask','localytics.directives', 'ui.select'), 
            })
            .state('app.testPage', {
				url: '/test-state-resolve/:establishmentId',
				title: 'test page',
				templateUrl: '/app/custom/tests/test-state-resolve.html',
				controller: 'testStateResolveController',
				controllerAs: 'vm',
                resolve: angular.extend(
                    helper.resolveFor('taginput', 'inputmask','localytics.directives', 'ngDialog', 'ui.select'),
                    {
                        // YOUR RESOLVES GO HERE
                        establishment: function($stateParams, establishmentService){
                            establishmentService.getEstablishment($stateParams.establishmentId)
												.then(function(result) {
													var item = result.data;
													return item;
												})
												.catch(function(error){
													return null;
												});
                        }
                    }
                ),
            })
            .state('app.testRentokilCreateEgarFromPlanvis', {
				url: '/testRentokilCreateEgarFromPlanvis',
				title: 'Test Rentokil Create Egar From Planvis',
				templateUrl: '/app/custom/tests/test.rentokil.createEgarFromPlanvis.html',
				controller: 'testRentokilCreateEgarFromPlanvisController',
				controllerAs: 'vm',
            })
            .state('app.testRentokilGetUserPlanvis', {
				url: '/testRentokilGetUserPlanvis',
				title: 'Test Rentokil Ger User Planvis V2',
				templateUrl: '/app/custom/tests/test.rentokil.getUserPlanvisV2.html',
				controller: 'testRentokilGetUserPlanvisControllerV2',
                controllerAs: 'vm',
			})
			.state('app.testGoToAngular9', {
				url: '/testGoToAngular9',
				title: 'Test testGoToAngular9',
				templateUrl: '/app/custom/tests/tests.angular9.html',
				controller: 'testGoToAngular9',
                controllerAs: 'vm',
            })
			.state('app.testSmartgarComponents', {
				url: '/testSmartgarComponents',
				title: 'Test smartgar components',
				templateUrl: '/app/custom/tests/test-smartgar-components.html',
				controller: 'testSmartgarComponentsController',
				controllerAs: 'vm',
				resolve: angular.extend(
                    helper.resolveFor('taginput', 'inputmask','localytics.directives', 'ngDialog', 'ui.select')
                ),
            })
			;
	}
})();