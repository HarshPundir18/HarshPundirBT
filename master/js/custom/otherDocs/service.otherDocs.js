(function(){
    'use strict';

    angular
        .module('custom')
        .service('otherDocsService', otherDocsService);

    otherDocsService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function otherDocsService ($http, $q, $log, $state, $location, localStorageService) {

        var baseUrl = '/api/other-docs'

        var _requestQuantitiesDeclaration = function (data) {
            return $http.post(`${baseUrl}/quantities-declarations`, data);
        }
        
        var _getGeneratedDocuments = function(){
            return $http.get(`${baseUrl}/generated-documents/exsitu/quantities-declarations`);
        }
        
        var _getGeneratedDocumentDetails = function(id){
            return $http.get(`${baseUrl}/generated-documents/exsitu/quantities-declarations/${id}`);
        }

        var _downloadExSituDeclarationFile = function(requestId, fileId){
            return $http.get(`${baseUrl}/generated-documents/exsitu/quantities-declarations/${requestId}/${fileId}/download`, { responseType: "arraybuffer" });
        }

        var _downloadAsyncReport = (fileId)=>{
			return $http.get(`${baseUrl}/generated-documents/reports/${fileId}/download`, { responseType: "arraybuffer" });
		}

        this.downloadExSituDeclarationFile = _downloadExSituDeclarationFile;
        this.getGeneratedDocumentDetails = _getGeneratedDocumentDetails;
        this.requestQuantitiesDeclaration  = _requestQuantitiesDeclaration;
        this.getGeneratedDocuments = _getGeneratedDocuments;
        this.downloadAsyncReport = _downloadAsyncReport;
    }
})();


