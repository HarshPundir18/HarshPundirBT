(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(garsArchiveState);

    garsArchiveState.$inject = ['$stateProvider', 'RouteHelpersProvider'];
    function garsArchiveState($stateProvider, helper){
        
        $stateProvider
            .state('app.egarArchive', {
                url: '/gars-archive/:year',
                title: 'Arquivo e-Gars',
                templateUrl: '/app/custom/garsArchive/gars.archive.html',
                controller: 'garsArchiveController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('ngDialog')
            })
            .state('app.egarArchiveEstablishment', {
                url: '/gars-archive/:year/establishment/:establishmentId',
                title: 'Arquivo e-Gars',
                templateUrl: '/app/custom/garsArchive/gars.archive.establishment.html',
                controller: 'garsArchiveEstablishmentController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
          ;
    }
})();