(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(settingsState);

    settingsState.$inject = ['$stateProvider', 'RouteHelpersProvider'];
    function settingsState($stateProvider, helper){
        
        $stateProvider
            .state('app.appSettingsEgarCreationRulesNew', {
                url: '/appSettings/egar-creation-rule',
                title: 'Regra de criação e-GAR',
                templateUrl: '/app/custom/settings/egar-creation-rules-createOrEdit.html',
                controller: 'EgarCreationRulesController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ngDialog', 'ui.select')
            })
            .state('app.appSettingsEgarCreationRulesDuplicate', {
                url: '/appSettings/egar-creation-rule/duplicate/:id',
                title: 'Duplicar regra de criação e-GAR',
                templateUrl: '/app/custom/settings/egar-creation-rules-createOrEdit.html',
                controller: 'EgarCreationRulesController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ngDialog', 'ui.select')
            })
            .state('app.appSettingsEgarCreationRulesEdit', {
                url: '/appSettings/egar-creation-rule/:id',
                title: 'Editar regras de criação e-GAR',
                templateUrl: '/app/custom/settings/egar-creation-rules-createOrEdit.html',
                controller: 'EgarCreationRulesController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('taginput','inputmask','localytics.directives', 
                                            'ui.bootstrap-slider', 'ngWig',
                                            'filestyle', 'ngDialog', 'ui.select')
            })
            .state('app.appSettingsEgarCreationRules', {
                url: '/appSettings/egar-creation-rules',
                title: 'Regras de criação e-GAR',
                templateUrl: '/app/custom/settings/egar-creation-rules-overview.html',
                controller: 'EgarCreationRulesOverviewController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
            .state('app.appSettings', {
                url: '/appSettings/:tabId',
                title: 'Configurações',
                templateUrl: '/app/custom/settings/settings.html',
                controller: 'settingsController',
                controllerAs: '$ctrl',
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
            
          ;
    }
})();