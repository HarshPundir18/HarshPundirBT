//Mock

(function() {
    'use strict';


    //initializeStubbedBackend()

    function getJsonFromFile(url) {
        console.log('mock -> ' + url);
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        return [request.status, request.response, {}];
    }

    function initializeStubbedBackend() {
        angular
            .module('custom')
            .config(function($provide) {
                $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
            })
            .run(['$httpBackend', function($httpBackend) {
                //let them go!
                $httpBackend.when('GET', /\.json/).passThrough();
                $httpBackend.when('GET', /\.html/).passThrough();

                //these we want to mock!
                $httpBackend.when('GET', /api\/dummy/).respond(function(method, url, data) {
                    return getJsonFromFile('assets/data/dummy.json');
                });

                $httpBackend.when('GET', /api\/security\/vertical-menus/).respond(function(method, url, data) {
                    return getJsonFromFile('assets/data/mocks/menu.sidebar.json');
                });

                $httpBackend.when('GET', /api\/egar\/APA00076315\/*/)
                .respond(function(method, url, data) {
                    console.log('yeupii');
                    return getJsonFromFile('assets/data/mocks/get.egars.json');
                });




                //let all the other passThrough
                $httpBackend.when('GET', function(url){
                     return true;
                }).passThrough();
                $httpBackend.when('POST', function(url){ 
                    return true; 
                }).passThrough();
                $httpBackend.when('PUT', function(url){ return true; }).passThrough();
                $httpBackend.when('DELETE', function(url){ return true; }).passThrough();
        }]);
    }

})();