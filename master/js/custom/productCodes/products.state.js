(function () {
	'use strict';

	angular
		.module('app.routes')
		.config(productsState);

    productsState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
	function productsState($stateProvider, $locationProvider, $urlRouterProvider, helper) {

		$stateProvider
			.state('app.productsList', {
				url: '/products-codes',
				title: 'Etiquetas',
				templateUrl: '/app/custom/productCodes/productCodes.overview.html',
				controller: 'ProductsListController',
				controllerAs: 'vm',
				resolve: helper.resolveFor('datatables', 'ngDialog')
            })
            .state('app.productsNew', {
				url: '/products-codes/new',
				title: 'Criar Etiqueta',
				templateUrl: '/app/custom/productCodes/productCodes.new.html',
				controller: 'ProductCreateOrUpdateController',
				controllerAs: 'vm',
				resolve: helper.resolveFor('ngDialog', 'taginput','inputmask','localytics.directives', 
                'ui.bootstrap-slider', 'ngWig', 'filestyle', 
                'ui.select')
            })
            .state('app.productsEdit', {
				url: '/products-codes/edit/:id',
				title: 'Editar Etiqueta',
				templateUrl: '/app/custom/productCodes/productCodes.new.html',
				controller: 'ProductCreateOrUpdateController',
				controllerAs: 'vm',
				resolve: helper.resolveFor('ngDialog',  'ui.select')
            })
            .state('app.productGroup', {
                url: '/products-codes/groups/:id',
                title: 'Grupo de Etiquetas',
                templateUrl: '/app/custom/productCodes/group.html',
                controller: 'ProductGroupController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig', 'filestyle', 
                                            'ui.select', 'datatables', 'ngDialog')
            })
            .state('app.productGroupList', {
                url: '/products-codes/groups',
                title: 'Lista Etiquetas',
                templateUrl: '/app/custom/productCodes/groups-overview.html',
                controller: 'ProductGroupListController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'ngDialog'),
            })
			;
	}
})();