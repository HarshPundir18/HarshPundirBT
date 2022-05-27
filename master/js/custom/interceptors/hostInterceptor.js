(function(){
    'use strict';

    angular
      .module('app.dashboard')
      .factory('hostInterceptor', hostInterceptor);

    hostInterceptor.$inject = ["$templateCache"];
    function hostInterceptor($templateCache) {

        var appSettings = window.appSettings;
        return {
            request: function (config) {

                var url = config.url;
                if($templateCache.get(url)) {
                    return config;
                }

                if(appSettings.debug && appSettings.apiHost && isApiUrl(url) && isRelative(url)) {
                    config.url = appSettings.apiHost;
                    if(!startsWithSlash(url)) {
                        config.url += '/';
                    }
                    config.url += url;
                    config.withCredentials = true;
                }

                return config;
            }
        };
    }
    
    var REGEX_HTTP_PROTOCOL_REGEXP = /^https?:\/\/|^\/\//i;

    function isApiUrl(url) {
        return (url.indexOf('token') > -1) || (url.indexOf('api') > -1);
    }

    function isRelative(url) {
        return !REGEX_HTTP_PROTOCOL_REGEXP.test(url);
    }

    function startsWithSlash(url) {
        return (url.indexOf('/') === 0);
    }

})();