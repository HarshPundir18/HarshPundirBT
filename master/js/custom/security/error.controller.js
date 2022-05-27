(function() {
    'use strict';

    angular
        .module('custom')
        .controller('errorController', errorController);

    errorController.$inject = ['$window', '$rootScope', '$scope', '$compile', '$http', '$state', '$location', '$routeParams', '$stateParams',
                                'translationService'];
    function errorController($window, $rootScope, $scope, $compile, $http, $state, $location, $routeParams, $stateParams,
                                translationService) {
        
        //VM stuff
        var vm = this;

        vm.back = function(){
			$window.location.href=$stateParams.url;
        }

		vm.support = function(){
			alert('go to support')
		}

        //
        activate();

        //CALLBACKS

        //PRIVATES
        function activate(){

        }

        //SCOPE stuff
    }
})();