(function () {
	'use strict';

	angular
		.module('custom')
		.controller('myEstablishmentsOverviewController', myEstablishmentsOverviewController);

	myEstablishmentsOverviewController.$inject = ['$scope', '$compile', '$log', '$http', '$state', '$filter', 'ngDialog',
		'establishmentService', 'spinnerService', 'translationService', 'userService',
		'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder'];

	function myEstablishmentsOverviewController($scope, $compile, $log, $http, $state, $filter, ngDialog,
		establishmentService, spinnerService, translationService, userService,
		DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

        var vm = this;
        //console.log('myEstablishmentsOverviewController');
		vm.dataTableCurrentStart = null;
		vm.dtInstance = {};
		vm.btnOriginSelected = false;
		vm.btnTransporterSelected = false;
		vm.btnDestinSelected = true;

		vm.showActionClick = function (establishmentId) {
			$log.info('showActionClick ' + establishmentId);
		}

		vm.editActionClick = function (establishmentId) {
			$state.go('app.myEditEstablishment', { establishmentId: establishmentId })
		}

		activate();

		////////////////

		function activate() {

            userService
                .checkCanCreateAccountEstablishments()
                .then(function(result){
                    vm.canCreateAccountEstablishments = result.data
                });

			DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

			vm.dtColumns = [
				DTColumnBuilder.newColumn('Name', 'Nome')
					.notSortable()
					.withClass('sorting_disabled')
					.withClass('dt-center col-sm-2'),
				DTColumnBuilder.newColumn('Address.DisplayAddress', 'Morada')
					.notSortable()
					.withClass('sorting_disabled')
					.withClass('dt-center col-sm-2'),
				DTColumnBuilder.newColumn('Vat', 'Nif')
					.notSortable()
					.withClass('dt-center col-sm-1'),
				DTColumnBuilder.newColumn('ApaCode', 'Código APA')
					.notSortable()
					.withClass('dt-center col-sm-1'),
				DTColumnBuilder.newColumn('ApaCode', 'Código APA')
					.notSortable()
					.withClass('dt-center col-sm-1'),
				DTColumnBuilder
					.newColumn('Actions')
					.notSortable()
					.withClass('dt-center action-buttons col-sm-1')
					.renderWith(renderActions)
			];

			vm.dtOptions = DTOptionsBuilder
				.newOptions()
				.withOption('responsive', true)
				.withOption('bFilter', true)            //show/hide search box
				.withOption('searchDelay', 500)
				.withOption('bLengthChange', false)     //hide change page size
				.withOption('createdRow', createdRow)   //needed to create row/column actions
				.withOption('ajax', function (dataTable, callback, settings) {
					var firstPage = dataTable.start != vm.dataTableCurrentStart;
					var noSearch = dataTable.search.value == '';
					var hasValidSearch = dataTable.search && dataTable.search.value && dataTable.search.value.length > 2;

					spinnerService.show('.panel-body');
					establishmentService.getAllClientEstablishments(dataTable)
						.then(function (result) {
							if (result) {
								vm.dataTableCurrentStart = result.start;
								vm.dataTableCurrentItems = result.data.aaData;
								callback(result.data);
							}
						}, function (error) {

						})
						.finally(function () {
							spinnerService.hide('.panel-body');
						});
				})
				.withDataProp('data')
				.withOption('serverSide', true)
				.withPaginationType('full_numbers');
		}


		function renderActions(establishment, msg, model, cell) {
            
			var actionShow = '';
			var actionEdit = '';
			var actionDelete = '';

            if(model.PermisionType === 10){
                actionShow = "<span title='Ver' ng-click=$ctrl.showActionClick('" + model.UniqueId + "')><em class='fa fa-eye'></em></span>";
			    actionEdit = "<span title='Editar' ng-click=$ctrl.editActionClick('" + model.UniqueId + "')><em class='fa fa-pencil'></em></span>";    
            }
						
			return actionEdit;
		}


		function createdRow(row, data, dataIndex) {
			// Recompiling so we can bind Angular directive to the DT 
			$compile(angular.element(row).contents())($scope);
		}
	}
})();
