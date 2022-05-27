(function(){
    'use strict';

    angular
        .module('custom')
        .service('garsAttachmentService', garsAttachmentService);

    //garsAttachmentService.$inject = ['$http'];
    function garsAttachmentService ($http, $q, browserService) {

        var baseUrl = '/api/egar/attachment';

        var _getEgarsAttachmentRcd = function(data){
            return $http.post(baseUrl + '/rcd', data);
        }


        var _downloadFile = function (data) {

            if(browserService.ie()){
                alert('O Internet Explorer não suporta esta operação! \n Por favor tente com Chrome, Firefox ou Edge.');
                return;
            }

            var deferred = $q.defer();
            $http
                .post(baseUrl + '/rcd/create', data, {
                    responseType: "arraybuffer",
                })
                .then(
                    function (data, status, headers) {
                        var contentType = data.headers('Content-Type');
                        var filename = data.headers('x-smg-filename');

                        try {
                            var blob = new Blob([data.data], { type: contentType });
                            var url = window.URL.createObjectURL(blob);
                            var linkElement = document.createElement('a');
                            linkElement.setAttribute('href', url);
                            linkElement.setAttribute("download", filename);

                            var clickEvent = new MouseEvent("click", {
                                "view": window,
                                "bubbles": true,
                                "cancelable": false
                            });
                            linkElement.dispatchEvent(clickEvent);
                        } catch (ex) {
                            alert('O seu Browser nao suporta esta operação!')
                            console.log(ex);
                        }

                        deferred.resolve(filename);
                    }, 
                    function (error) {
                        deferred.reject(error);
                    });

            return deferred.promise;
        }

        this.getEgarsAttachmentRcd = _getEgarsAttachmentRcd;
        this.downloadFile = _downloadFile;
    }
})();
