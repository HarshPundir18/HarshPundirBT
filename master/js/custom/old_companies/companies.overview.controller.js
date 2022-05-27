(function() {
    'use strict';

    angular
        .module('custom')
        .controller('companiesOverviewController', companiesOverviewController);

    companiesOverviewController.$inject = ['$rootScope', '$state', 'uiGridConstants', '$scope','$http', '$timeout', '$q', '$log', '$templateCache', 'gridService', 'companiesService'];
    function companiesOverviewController($rootScope, $state, uiGridConstants, $scope, $http, $timeout, $q, $log, $templateCache, gridService, companiesService) {
 
        var vm = this;
        
 
        $scope.columnDefs = [
            {
                name:'CompanyId',
                enableColumnMenu: false
            },
            {
                name:'Name',
                enableColumnMenu: false
            },
            { 
                name: 'cumulativeWidgets', 
                
                enableFiltering: false,
                width: '50',
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP">' +
                '<span class="ui-grid-cell-action fa fa-desktop" ng-dblclick="grid.appScope.onDoubleClickDetails(row)"></span>' +
                '<span class="ui-grid-cell-action  fa fa-pencil" ng-dblclick="grid.appScope.onDoubleClickEdit(row)"></span>' +
                '</div>'
            }
        ];

 		$scope.grid = gridService.create({
            gridOptions: {
                columnDefs: $scope.columnDefs,
                enableFiltering: true,
                useExternalFiltering: true,
                useExternalSorting: true,
				enableRowSelection: true,
 				// rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"' +
				//   'ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'custom\': true }" ui-grid-cell ng-dblclick="grid.appScope.rowDblClick(row)"></div>'
            },
            dataObject: 'items',
            scope: $scope,
            getData: function(offset, limit, filters, sort) {
                return companiesService.getCompanies(offset, limit, filters, sort);
            }
        });

        $scope.rowDblClick = function(row) {
            //$state.go('root.companies.details', { companyId: row.entity.id });
			alert(row);
        };
		
        $scope.onDoubleClickDetails = function(row) {
			//$state.go('root.companies.details', { companyId: row.entity.id });
            alert(row);
		};
        
        $scope.onDoubleClickEdit = function(row) {
			$state.go('app.editCompany', { companyId: row.entity.CompanyId });
		};
        
        var _goToNewCompany = function(offset, limit, filters, sort) {
            $state.go('app.newCompany');
        };

        vm.goToNewCompany = _goToNewCompany;
    }	
})();
