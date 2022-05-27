(function(){
  'use strict';

  angular
    .module('app.dashboard')
    .config(configInterceptors);

    function configInterceptors($httpProvider){
        //$httpProvider.interceptors.push('versionInterceptor');
        
        $httpProvider.interceptors.push('errorInterceptor');
        
        //
        var appSettings = window.appSettings;
        if(angular.isString(appSettings.apiHost)) {
        	$httpProvider.interceptors.push('hostInterceptor');	
        }
    }
})();
