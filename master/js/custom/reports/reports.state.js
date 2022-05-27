(function () {
	'use strict';

	angular
		.module('app.routes')
		.config(reportsState);

	reportsState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider', '$injector'];
	function reportsState($stateProvider, $locationProvider, $urlRouterProvider, helper, $injector) {

		$stateProvider
			.state('app.reports', {
				url: '/reports',
				title: 'Relatórios',
				templateUrl: '/app/custom/reports/reports.html',
				controller: 'reportsController',
				controllerAs: '$ctrl',
				resolve: helper.resolveFor('ngDialog','inputmask','localytics.directives', 'ui.select'), 
			})
			//app.genericReports is the V2 of reports
			.state('app.genericReports', { 
				url: '/generic-reports/:previousState',
				title: 'Relatórios',
				templateUrl: '/app/custom/reports/generic.reports.html',
				controller: 'GenericReportsController',
				controllerAs: 'vm',
				resolve: helper.resolveFor('ngDialog','inputmask','localytics.directives', 'ui.select'), 
			})
			.state('app.reportsHub', { 
				url: '/reports-hub',
				title: 'Relatório Geral',
				templateUrl: '/app/custom/reports/reports.hub.html',
				controller: 'ReportsHubController',
				controllerAs: 'vm',
				resolve: helper.resolveFor('ngDialog','inputmask','localytics.directives', 'ui.select'), 
			})
			.state('app.receivedQuantitiesSummaryReport', { 
				url: '/reports/received-quantities-summary',
				title: 'Resumo de quantidades recebidas - e-GARs Tipo 1 (Produtor)',
				templateUrl: '/app/custom/reports/receivedQuantitiesSummaryReport.html',
				controller: 'ReceivedQuantitiesSummaryReportController',
				controllerAs: 'vm',
				resolve: helper.resolveFor('ngDialog','inputmask','localytics.directives', 'ui.select'), 
			})
			.state('app.servicesReceivedQuantitiesSummaryReport', { 
				url: '/reports/services-received-quantities-summary',
				title: 'Resumo de quantidades recebidas - e-GARs Tipo 2 (Serviços)',
				templateUrl: '/app/custom/reports/rcdOrServices.receivedQuantitiesSummaryReport.html',
				controller: 'RcdOrServicesReceivedQuantitiesSummaryReportController',
				controllerAs: 'vm',
				resolve: helper.resolveFor('ngDialog','inputmask','localytics.directives', 'ui.select'), 
			})
			.state('app.rcdReceivedQuantitiesSummaryReport', { 
				url: '/reports/rcd-received-quantities-summary',
				title: 'Resumo de quantidades recebidas - e-GARs Tipo 2 (RCDs)',
				templateUrl: '/app/custom/reports/rcdOrServices.receivedQuantitiesSummaryReport.html',
				controller: 'RcdOrServicesReceivedQuantitiesSummaryReportController',
				controllerAs: 'vm',
				resolve: helper.resolveFor('ngDialog','inputmask','localytics.directives', 'ui.select'), 
			})
			.state('app.exsituReceivedQuantitiesSummaryReport', { 
				url: '/reports/exsitu-received-quantities-summary',
				title: 'Resumo de quantidades recebidas - e-GARs Tipo 2 (EXSITUs)',
				templateUrl: '/app/custom/reports/ouaOrExsitu.receivedQuantitiesSummaryReport.html',
				controller: 'OuaOrExsituReceivedQuantitiesSummaryReportController',
				controllerAs: 'vm',
				resolve: helper.resolveFor('ngDialog','inputmask','localytics.directives', 'ui.select'), 
			})
			.state('app.ouaReceivedQuantitiesSummaryReport', { 
				url: '/reports/oua-received-quantities-summary',
				title: 'Resumo de quantidades recebidas - e-GARs Tipo 2 (OAUs)',
				templateUrl: '/app/custom/reports/ouaOrExsitu.receivedQuantitiesSummaryReport.html',
				controller: 'OuaOrExsituReceivedQuantitiesSummaryReportController',
				controllerAs: 'vm',
				resolve: helper.resolveFor('ngDialog','inputmask','localytics.directives', 'ui.select'), 
			})
			;
	}
})();