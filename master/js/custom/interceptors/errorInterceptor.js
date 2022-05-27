(function(){
    'use strict';

    angular
      .module('app.dashboard')
      .factory('errorInterceptor', errorInterceptor);

    errorInterceptor.$inject = ['$injector', '$log', '$location', 'Notify'];
    function errorInterceptor($injector, $log, $location, Notify) {
            var inFlight = null;
            var authInterceptorServiceFactory = {};

            var _request = function (config) {

                config.headers = config.headers || {};
                
                var oauthToken = $injector.get('oauthService').getAuthorizationHeader();
                if (oauthToken) {
                    config.headers.Authorization = oauthToken;    
                }

                return config;
            }
            
            var _responseError = function (rejection) {       
                var deferred = $injector.get('$q').defer();
                switch(rejection.status){
                    
                    case -1:
                        deferred.reject(rejection);
                            //$injector.get('$state').go('page.500',{url: $location.$$absUrl});
                            Notify.alert( 
                                '<em class="fa fa-cross"></em><p>Não foi possível executar a operação!</p>'+
                                '<p>Se erro persistir por favor contacte o suporte.</p>', 
                                { status: 'danger'}
                            );
                        break;

                    case 401:
                        if(inFlight == null){
                            var authService = $injector.get('oauthService');
                            inFlight = authService.refreshToken2()
                        }
                        inFlight
                            .then(function (response) {
                                _retryHttpRequest(rejection.config, deferred)
                                    .then(function (result) {
                                        deferred.resolve(result);
                                        inFlight = null;
                                    }, function(err, status) {
                                        deferred.reject(err);
                                        inFlight = null;
                                    })
                                    ;
                                $injector.get('oauthService').setLocalStorageData(response.data);
                            },
                            function (err, status) {
                                    $injector.get('oauthService').logOut();
                                    $log.info('go to login');
                                    $log.info(rejection.config.url);
                                    $location.path('/page/login');
                            });
                        break;
                    
                    case 403:
                        //alert('403');
                        deferred.reject(rejection);
                        break;

                    case 404:
                        deferred.reject(rejection);
                        $injector.get('$state').go('page.404',{url: $location.$$absUrl});
                        break;

                    case 500:
                        //alert('500');
                        deferred.reject(rejection);
                        //$injector.get('$state').go('page.500',{url: $location.$$absUrl});
                        Notify.alert( 
                            '<em class="fa fa-cross"></em><p>Não foi possível executar a operação!</p>'+
                            '<p>Se erro persistir por favor contacte o suporte.</p>', 
                            { status: 'danger'}
                        );
                        break;
                    
                    default:
                        deferred.reject(rejection);
                        break;
                } 
                
                return deferred.promise;
            }

            var _retryHttpRequest = function (config, deferred) {
                var $http = $http || $injector.get('$http');
                return $http(config);
            }

            authInterceptorServiceFactory.request = _request;
            authInterceptorServiceFactory.responseError = _responseError;

            return authInterceptorServiceFactory;
        }
})();