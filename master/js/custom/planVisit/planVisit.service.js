(function(){
    'use strict';

    angular
        .module('custom')
        .service('planVisitService', planVisitService);

    planVisitService.$inject = ['$http'];
    function planVisitService ($http) {

        var baseUrl = '/api/m/visits';
        
        var _testGetEgarFromPlanVisit = function(planVisitLine){
            return $http.post(`${baseUrl}/egar/11111/get-egar/test`, {Line: planVisitLine});
        }

        var _testCreateEgarFromPlanVisit = function(egar){
            return $http.post(`${baseUrl}/egar/11111/create-egar/test`, egar)
        }        

        var _getUserPlanVisit = function(){
            return $http.get(`${baseUrl}/egar-v2`);
        }

        this.testGetEgarFromPlanVisit = _testGetEgarFromPlanVisit;
        this.testCreateEgarFromPlanVisit = _testCreateEgarFromPlanVisit;
        this.getUserPlanVisit = _getUserPlanVisit;
    }
})();