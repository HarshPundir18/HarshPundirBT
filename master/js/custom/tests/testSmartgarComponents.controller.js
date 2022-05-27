(function () {
    'use strict';

    angular
        .module('custom')
        .controller('testSmartgarComponentsController', testSmartgarComponentsController);

        testSmartgarComponentsController.$inject = ['$scope', '$route'];
    function testSmartgarComponentsController($scope, $route) {
        var vm = this;

        vm.offset = 0;
        vm.pageSize = 5;

        vm.onChange = function(obj){
            console.log('Tests controller onChange');
        }

        vm.onLoadMore = function(){
            console.log('Tests controller onLoadMore');
        }

        vm.onSearchEstablishmentsChange = function(obj){
            console.log('Test components... onSearchEstablishmentsChange')
            console.log(obj);
        }     
    }
})();