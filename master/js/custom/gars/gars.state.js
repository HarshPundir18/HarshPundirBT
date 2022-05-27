(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(garsState);

    garsState.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function garsState($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        $stateProvider
            .state('app.eGarsList', {
                url: '/gars',
                title: 'Lista e-GARs',
                templateUrl: '/app/custom/gars/overview.gars.html',
                controller: 'garsOverviewController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('datatables', 'ngDialog', 'angularFileUpload', 'localytics.directives', 
                                                'ui.bootstrap-slider', 'ngWig',
                                                'filestyle', 'ngDialog', 'ui.select')
            })
            .state('app.overviewGars', {
                url: '/gars/list',
                title: 'Lista e-GARs',
                templateUrl: '/app/custom/gars/egars.list.html',
                controller: 'EgarListController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'ngDialog', 'angularFileUpload', 'localytics.directives', 
                                                'ui.bootstrap-slider', 'ngWig',
                                                'filestyle', 'ngDialog', 'ui.select')
            })
            // .state('app.newGar', {
            //     url: '/gars/new',
            //     title: 'Nova e-Gar',
            //     templateUrl: '/app/custom/gars/new.gar.html',
            //     controller: 'garsController',
            //     controllerAs: '$ctrl',
            //     resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
            //                                 'ui.bootstrap-slider', 'ngWig',
            //                                 'filestyle', 'ngDialog', 'ui.select')
            // })
            .state('app.newGarV2', {
                url: '/gars/new-v2',
                title: 'Nova e-Gar',
                templateUrl: '/app/custom/gars/new.gar.v2.html',
                controller: 'garsControllerV2',
                controllerAs: 'vm',
                resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ngDialog', 'ui.select')
            })
            .state('app.rectifyGar', {
                url: '/gars/rectify/:garId',
                title: 'Corrigir e-Gar',
                templateUrl: '/app/custom/gars/rectify.gar.html',
                resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig', 
                                            'filestyle', 'ngDialog', 'ui.select'),
                controller: 'editGarsController',
                controllerAs: '$ctrl'
            })
            .state('app.importGars', {
                url: '/gars/import',
                title: 'Importar e-Gar',
                templateUrl: '/app/custom/gars/import.gar.html', 
                controller: 'importGarController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('ngDialog', 'localytics.directives')
            })
            .state('app.consultGar', {
                url: '/gars/consult/:garId',
                title: 'Consultar Gar',
                templateUrl: '/app/custom/gars/consult.gar.html', 
                controller: 'editGarsController',
                controllerAs: '$ctrl'
            })

            .state('app.editGar', {
                url: '/gars/edit/:garId',
                title: 'Editar e-Gar',
                templateUrl: '/app/custom/gars/edit.gar.html', 
                resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig', 
                                            'filestyle', 'ngDialog', 'ui.select'),
                controller: 'editGarsController',
                controllerAs: '$ctrl'
            })

            // .state('app.duplicateGar', {
            //     url: '/gars/new/duplicate/:garId',
            //     title: 'Nova e-Gar',
            //     templateUrl: '/app/custom/gars/new.gar.html',
            //     controller: 'garsController',
            //     controllerAs: '$ctrl',
            //     resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
            //                                 'ui.bootstrap-slider', 'ngWig',
            //                                 'filestyle', 'ngDialog', 'ui.select')
            // })
            .state('app.duplicateGarV2', {
                url: '/gars/new-v2/duplicate/:garId',
                title: 'Duplicar e-GAR',
                templateUrl: '/app/custom/gars/new.gar.v2.html',
                controller: 'garsControllerV2',
                controllerAs: 'vm',
                resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ngDialog', 'ui.select')
            })
            
            //Anonymous eGar pages
            .state('page.anonymousConsultGar', {
                url: '/gars/private/consult/egar/:hash',
                title: 'Autorizar e-Gar',
                templateUrl: '/app/custom/gars/anonymous.consult.finished.egar.html', 
                controller: 'garRequestAuthorizationController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('ngDialog')
            })
            //as Destin, requests Origin to authorize gar emission
            .state('page.authorizeGarEmission', {
                url: '/gars/authorization-request/:hash',
                title: 'Autorizar e-Gar',
                templateUrl: '/app/custom/gars/anonymous.egar.authorization.html', 
                controller: 'garRequestAuthorizationController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('ngDialog')
            })

            //as Destin, i request Origin to accept rectification
            .state('page.acceptGarRectification', {
                url: '/gars/rectification-acceptance-request/:hash',
                title: 'Autorizar e-Gar',
                templateUrl: '/app/custom/gars/anonymous.rectification.acceptance.html', 
                controller: 'anonymousRectificationAcceptanceController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('ngDialog')
            })

            //as Origin, requests Destin to accept/reject/rectify gar emission
            .state('page.acceptGarEmission', {
                url: '/gars/acceptance-request/:hash',
                title: 'Autorizar e-Gar',
                templateUrl: '/app/custom/gars/anonymous.acceptance.html', 
                controller: 'anonymousAcceptanceController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('ngDialog', 'localytics.directives'),
                //resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle'),
            })

            .state('app.batchAcceptanceList', {
                url: '/gars/batch-accept',
                title: 'Lote de e-Gars',
                templateUrl: '/app/custom/gars/batch.acceptance.list.html',
                controller: 'garsBatchAcceptanceListController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'localytics.directives', 
                                            'ngDialog', 'taginput','inputmask', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ui.select')
            })   

            .state('app.batchAcceptanceCreate', {
                url: '/gars/batch-accept/create',
                title: 'Criar lote de e-Gars para aceitação',
                templateUrl: '/app/custom/gars/batch.acceptance.create.html',
                controller: 'garsBatchAcceptanceCreateController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'localytics.directives', 
                                            'ngDialog', 'taginput','inputmask', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ui.select')
            })

            .state('app.batchAcceptanceDetail', {
                url: '/gars/batch-accept/:id',
                title: 'Lote de e-Gars',
                templateUrl: '/app/custom/gars/batch.acceptance.detail.html',
                controller: 'garsBatchAcceptanceDetailController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'ngDialog')
            })
            
            .state('app.batchAcceptance', {
                url: '/gars/batch-accept',
                title: 'Lote de e-Gars',
                templateUrl: '/app/custom/gars/batch.acceptance.html',
                controller: 'garsBatchAcceptanceController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('localytics.directives', 
                                        'ui.bootstrap-slider', 'ngWig', 'ngDialog')
            })


            .state('app.egarsSync', {
                url: '/gars/sync',
                title: 'Sincronização de e-Gars',
                templateUrl: '/app/custom/gars/synchronization.html',
                controller: 'garsSynchronizationController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'ngDialog')
            })

            .state('app.garslegalDeadlinesList', { //TODO: REMOVE, replaced by state app.expiringEgarAsDestinList and expiringEgarAsOriginList
                url: '/legal-deadlines/:type',
                title: 'Prazos Legais',
                templateUrl: '/app/custom/gars/overview.gars.html',
                controller: 'garsOverviewController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('datatables', 'ngDialog', 'angularFileUpload', 'localytics.directives', 
                                                'ui.bootstrap-slider', 'ngWig',
                                                'filestyle', 'ngDialog', 'ui.select')
            })

            .state('app.expiringEgarList', { 
                url: '/egars/expiring',
                title: 'e-GARs a expirar',
                templateUrl: '/app/custom/gars/expiring.egars.list.html',
                controller: 'ExpiringEgarListController',
                controllerAs: 'vm',
                params: {
                    eGarExpiringType: null,
                },
                resolve: helper.resolveFor('datatables', 'ngDialog', 'angularFileUpload', 'localytics.directives', 
                                                'ui.bootstrap-slider', 'ngWig', 'filestyle', 'ngDialog', 'ui.select')
            })

            .state('app.batchAcceptRectificationList', {
                url: '/gars/batch-accept-rectification/list',
                title: 'Lote de e-Gars',
                templateUrl: '/app/custom/gars/batch.accept.rectification.list.html',
                controller: 'garsBatchAcceptRectificationListController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'localytics.directives', 
                                            'ngDialog', 'taginput','inputmask', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ui.select')
            })

            .state('app.batchAcceptRectificationCreate', {
                url: '/gars/batch-accept-rectification/create',
                title: 'Criar lote de e-Gars para aceitação de correção',
                templateUrl: '/app/custom/gars/batch.accept.rectification.create.html',
                controller: 'garsBatchAcceptRectificationCreateController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'localytics.directives', 
                                            'ngDialog', 'taginput','inputmask', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ui.select')
            })

        ;
    }
})();