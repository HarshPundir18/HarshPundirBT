(function(){
    'use strict';

    angular
        .module('custom')
        .service('garArchiveService', garArchiveService);

    garArchiveService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function garArchiveService ($http, $q, $log, $state, $location, localStorageService) {

        var baseUrl = '/api/gar-archive'

        var _getGarArchivePage = function getGarArchivePage(establishmentId, dataTable){
            return $http.get(buildFetchUrl(establishmentId, dataTable));
        }

        var _downloadFile = function downloadFile(garArchiveId) {
            var deferred = $q.defer();
            $http
                .get('/api/gar-archive/download/' + garArchiveId, {
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
                
                }, function (error) {
                    deferred.reject(error);
                })
            return deferred.promise;
        }

        var _requestArchive = function requestArchive(email, establishmentId, year) {
            return $http.post(`${baseUrl}/archive`, {
                Email: email,
                EstablishmentId: establishmentId,
                Year: year
            });
        }
        
        this.getGarArchivePage  = _getGarArchivePage;
        this.downloadFile = _downloadFile;
        this.requestArchive = _requestArchive;

        var buildFetchUrl = function(establishmentId, dataTable) {
            var establishment = establishmentId ? `&establishmentId=${establishmentId}` : '';
            var searchTerm = dataTable.search.value ? `&searchTerm=${dataTable.search.value}` : '';
            var url = `${window.appSettings.apiHost}${baseUrl}/page?start=${dataTable.start}&pageSize=${dataTable.length}${searchTerm}${establishment}`;
            return url;
        }
    }
})();


