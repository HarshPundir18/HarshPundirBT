// (function() {
//     'use strict';

//     angular
//         .module('custom')
//         .controller('establishmentOverviewController', establishmentOverviewController);

//     establishmentOverviewController.$inject = ['$rootScope', '$state', '$scope','$http', '$timeout',
//                                                 '$q', '$log', '$templateCache', 'establishmentService'];
//     function establishmentOverviewController($rootScope, $state, $scope, $http, $timeout,
//                                                 $q, $log, $templateCache, establishmentService) {

//         var vm = this;

//         var _goToNewEstablishment = function(offset, limit, filters, sort) {
//             $state.go('app.establishmentNew');
//         };

//         vm.goToNewEstablishment = _goToNewEstablishment;
//     }	
// })();
