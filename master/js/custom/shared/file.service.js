(function(){
    'use strict';

    angular
        .module('custom')
        .service('fileService', fileService);

    fileService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function fileService ($http, $q, $log, $state, $location, localStorageService) {

        var _downloadFile = function(data, contentType, filename){
            try {
                var blob = new Blob([data], { type: contentType });
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
        }

        this.downloadFile = _downloadFile;
    }
})();
