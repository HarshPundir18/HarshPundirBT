(function(){
    'use strict';

    angular
        .module('custom')
        .service('contextService', contextService);

    contextService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function contextService ($http, $q, $log, $state, $location, localStorageService) {
      
      var CONTEXT_KEY = "contextData";

      var _setContextEstablishment = function(establishment){
        var context = localStorage.get(CONTEXT_KEY);
        if(context){
          context.establishment = establishment;
        }
        else{
          context = {
            establishment: establishment
          }
        }

        localStorage.set(CONTEXT_KEY, context);
      }

      var _getContextEstablishment = function(){
        var context = localStorage.get(CONTEXT_KEY);
        if(context){
          return context.establishment;
        }
        return null;
      }

      this.getContextEstablishment = _getContextEstablishment;
      this.setContextEstablishment = _setContextEstablishment;
    }
})();
