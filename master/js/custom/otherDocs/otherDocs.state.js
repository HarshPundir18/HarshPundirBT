(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(customState);

    customState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function customState($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        $stateProvider
            .state('app.otherDocsAnexo3', {
                url: '/other-docs/rcd/anexo3',
                title: 'Outros Documentos - Anexo 3 (RCDs)',
                templateUrl: '/app/custom/otherDocs/rcd.anexo3.html',
                controller: 'rcdAnexo3Controller',
                controllerAs: '$ctrl',
                //resolve: helper.resolveFor('datatables', 'ngDialog', 'ui.select'),

                resolve: helper.resolveFor('datatables', 'taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ngDialog', 'ui.select')
            })
            .state('app.otherDocsExSituQuantities', {
                url: '/other-docs/exsitu/quantities-declaration',
                title: 'Outros Documentos - Declaração de Quantidades (ExSitu)',
                templateUrl: '/app/custom/otherDocs/quantitiesDeclaration.exsitu.html',
                controller: 'exSituQuantitiesDeclarationController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ngDialog', 'ui.select')
            })
            .state('app.generatedDocumentsExSituDeclarationsList', {
                url: '/generated-documents/exsitu-declarations',
                title: 'Geração de Documentos',
                templateUrl: '/app/custom/generatedDocuments/exsitu.quantitiesDeclarations.list.html',
                controller: 'exSituDeclarationsListController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'localytics.directives', 
                                            'ngDialog', 'taginput','inputmask', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ui.select')
            })
            .state('app.generatedDocumentsExSituDeclarationDetails', {
                url: '/generated-documents/exsitu-declarations/:requestId',
                title: 'Geração de Documentos',
                templateUrl: '/app/custom/generatedDocuments/exsitu.quantitiesDeclarations.details.html',
                controller: 'generatedDocumentsDetailController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'localytics.directives', 
                                            'ngDialog', 'taginput','inputmask', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ui.select')
            })
            .state('app.otherDocsGeneralQuantities', {
                url: '/other-docs/general/quantities-declaration',
                title: 'Outros Documentos - Declaração de Quantidades',
                templateUrl: '/app/custom/otherDocs/quantitiesDeclaration.general.html',
                controller: 'generalQuantitiesDeclarationController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ngDialog', 'ui.select')
            })
            .state('app.generatedDocumentsAsyncReportList', {
                url: '/generated-documents/reports',
                title: 'Relatórios Assíncronos',
                templateUrl: '/app/custom/generatedDocuments/async.report.list.html',
                controller: 'asyncReportListController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'localytics.directives', 
                                            'ngDialog', 'taginput','inputmask', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ui.select')
            })
            .state('app.generatedDocumentsAsyncReportDetail', {
                url: '/generated-documents/reports/:reportId',
                title: 'Relatório Diferido',
                templateUrl: '/app/custom/generatedDocuments/async.report.detail.html',
                controller: 'asyncReportDetailController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ngDialog', 'ui.select')
            })
          ;
    }
})();