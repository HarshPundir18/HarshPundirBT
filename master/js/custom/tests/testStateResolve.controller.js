(function () {
    'use strict';

    angular
        .module('custom')
        .controller('testStateResolveController', testStateResolveController);

        testStateResolveController.$inject = ['$scope', '$route'];
    function testStateResolveController($scope, $route, establishment) {
        var vm = this;

        vm.offset = 0;
        vm.pageSize = 5;
        vm.fetch = function (selectSearch, $event){
            vm.items = [{uniqueId: 1, displayName: '1'},{uniqueId: 2, displayName: '2'}];
        }

        vm.onChange = function(obj){
            console.log('Tests controller onChange');
        }

        vm.onLoadMore = function(){
            console.log('Tests controller onLoadMore');
        }

        vm.fetch();
    }
})();