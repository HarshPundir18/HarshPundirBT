(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(massVolume);

        massVolume.$inject = ['$stateProvider', 'RouteHelpersProvider'];
    function massVolume($stateProvider, helper){
        
        $stateProvider
            .state('app.massVolumes', {
                url: '/massVolumes/:year',
                title: 'Volumes de massa',
                templateUrl: '/app/custom/massVolumes/massvolumes.overview.html',
                controller: 'massVolumesController',
                controllerAs: 'vm',
                resolve: helper.resolveFor('ngDialog')
            })
            ;
    }
})();