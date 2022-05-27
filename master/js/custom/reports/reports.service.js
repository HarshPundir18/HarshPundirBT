(function () {
	'use strict';

	angular
		.module('custom')
		.service('reportService', reportService);

	reportService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService', 'SMG_EGAR_TYPES'];
	function reportService($http, $q, $log, $state, $location, localStorageService, SMG_EGAR_TYPES) {

		var baseUrl = '/api/reports';


		var _createReport = function(request){
			return $http.post(baseUrl, request);
		}

		var _createReportV2 = function(request){
			return $http.post(`${baseUrl}/generic-report`, request);
		} 

		var _exportReportV2 = (request)=>{
			return $http.post(`${baseUrl}/generic-report-export`, request, { responseType: "arraybuffer" });
		}

		var _getPeriods = function () {
			return $http.get(baseUrl + '/periods');
		}


		var _getAsyncReportList = () => {
			return $http.get(`${baseUrl}/async-reports`);
		}

		var _getAsyncReportDetail = (id) => {
			return $http.get(`${baseUrl}/async-reports/${id}`);
		}


		var _createReceivedQuantitiesSummaryReport = (request, egarType)=>{

			switch(egarType){
				case SMG_EGAR_TYPES.PRODUTOR_ESTABELECIMENTO:
					return $http.post(`${baseUrl}/received-quantities-summary`, request);
				case SMG_EGAR_TYPES.OBRAS_RCD:
					return $http.post(`${baseUrl}/rcd-received-quantities-summary`, request);
				case SMG_EGAR_TYPES.PRESTADOR_SERVICOS:
					return $http.post(`${baseUrl}/services-received-quantities-summary`, request);
				case SMG_EGAR_TYPES.OLEOS_ALIMENTARES:
					return $http.post(`${baseUrl}/oau-received-quantities-summary`, request);
				case SMG_EGAR_TYPES.EX_SITU:
					return $http.post(`${baseUrl}/exsitu-received-quantities-summary`, request);
			
				default:
					throw "no egarType defined";		
			}
		}

		var _exportReceivedQuantitiesSummaryReport = (request, egarType)=>{
			switch(egarType){
				case SMG_EGAR_TYPES.PRODUTOR_ESTABELECIMENTO:
					return $http.post(`${baseUrl}/received-quantities-summary/export`, request, { responseType: "arraybuffer" });
				case SMG_EGAR_TYPES.OBRAS_RCD:
					return $http.post(`${baseUrl}/rcd-received-quantities-summary/export`, request, { responseType: "arraybuffer" });
				case SMG_EGAR_TYPES.PRESTADOR_SERVICOS:
					return $http.post(`${baseUrl}/services-received-quantities-summary/export`, request, { responseType: "arraybuffer" });
				case SMG_EGAR_TYPES.OLEOS_ALIMENTARES:
					return $http.post(`${baseUrl}/oau-received-quantities-summary/export`, request, { responseType: "arraybuffer" });
				case SMG_EGAR_TYPES.EX_SITU:
					return $http.post(`${baseUrl}/exsitu-received-quantities-summary/export`, request, { responseType: "arraybuffer" });
			
				default:
					throw "no egarType defined";		
			}
		}


		this.exportReceivedQuantitiesSummaryReport = _exportReceivedQuantitiesSummaryReport;
		this.createReceivedQuantitiesSummaryReport = _createReceivedQuantitiesSummaryReport;
		this.createReport = _createReport;
		this.createReportV2 = _createReportV2;
		this.exportReportV2 = _exportReportV2;
		this.getPeriods = _getPeriods;
		this.getAsyncReportList = _getAsyncReportList;
		this.getAsyncReportDetail = _getAsyncReportDetail;
	}
})();
