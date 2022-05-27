(function() {
    'use strict';

    angular
        .module('custom')
        .controller('userNotificationsTableController', userNotificationsTableController);

    userNotificationsTableController.$inject = ['$scope', '$compile', '$log', '$http', '$state', '$filter', 'ngDialog',
                                    'userNotificationService', 'spinnerService', 'translationService', 'utilsService',
                                    'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder'];
    function userNotificationsTableController($scope, $compile, $log, $http, $state, $filter, ngDialog,
                                    userNotificationService, spinnerService, translationService, utilsService,
                                    DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.dtInstance = {};
        vm.pageSize = 10;

        activate();

        ////////////////

        function activate() {
            
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

            vm.dtColumns = [
                DTColumnBuilder.newColumn('Sender', 'De')
                    .notSortable() 
                    .withClass('sorting_disabled')
                    .withClass('dt-center col-sm-1'),
               DTColumnBuilder.newColumn('Title', 'Assunto')
                    .notSortable() 
                    .withClass('sorting_disabled')
                    .withClass('dt-center col-sm-2'), 
                DTColumnBuilder.newColumn('Content', 'Conteúdo')
                    .notSortable()
                    .withClass('dt-center col-sm-5'),
                DTColumnBuilder.newColumn('FormatedDateCreated', 'Data')
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
                .withOption('ajax', function(dataTable, callback, settings) {
                    spinnerService.show('.panel-body');
                    userNotificationService.getUserNotifications(dataTable.start, dataTable.length, dataTable.search.value)
                        .then(function(result) {
                            if(result){
                                vm.dataTableCurrentItems = result.data.aaData;
                                callback(result.data);
                            }
                        }, function(error){

                        })
                        .finally(function(){
                            spinnerService.hide('.panel-body');
                        });
                })
                .withDataProp('data')
                //.withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers');
        }

        function renderActions(establishment, msg, model, cell){
            var actionShow = "<span id='" + model.UniqueId + "' title='Ver' ng-click=table1.showActionClick('" + model.UniqueId + "')><em class='fa fa-eye'></em></span>";
            var actionDelete = "<span title='Remover' ng-click=table1.deleteActionClick('" + model.UniqueId + "')><em class='fa fa-times'></em></span>";

            return actionShow + actionDelete;
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT 
			if(!data.IsRead){
				angular.element(row).addClass('text-bold');
            }

            $compile(angular.element(row).contents())($scope);
        }



        vm.showActionClick = function(uniqueId, elem){
            var userNotification = $filter('filter')(vm.dataTableCurrentItems, {'UniqueId': uniqueId})[0];
            if(!userNotification){
                return;
            }

			userNotificationService
				.markAsRead(uniqueId)
				.then(function(){
					var e = angular.element('#'+uniqueId);
				});

			ngDialog.open({
                template: '/app/custom/userNotifications/user.notification.dialog.html',
                className: 'ngdialog-theme-default',
                controller: 'userNotificationDialogController as undc',
                resolve : {
                    userNotification: function (){ return userNotification; }
                }
            })
        }

        vm.deleteActionClick = function(uniqueId){
            var userNotification = $filter('filter')(vm.dataTableCurrentItems, {'UniqueId': uniqueId})[0];
            if(!userNotification){
                return;
            }

            ngDialog.openConfirm({
                template: '/app/custom/userNotifications/user.notification.confirmDelete.dialog.html',
                className: 'ngdialog-theme-default',
                controller: 'userNotificationDialogController as undc',
                resolve : {
                    userNotification: function (){ return userNotification; }
                }
            })
            .then(function (value) {
				userNotificationService
					.deleteUserNotification(value)
				  	.then(deleteUserNotificationOnSuccess)
					.catch(deleteUserNotificationOnError);
                }, function (reason) {
					
			});
        }

		//callbacks
		function deleteUserNotificationOnSuccess(result){
            vm.dtInstance.reloadData(null, true);
			ngDialog.close();		
            utilsService.notifySuccess('Notificação apagada com sucesso!');
        }

       	function deleteUserNotificationOnError(error){
			ngDialog.close();		
            utilsService.notifyWarning('Não foi possivel apagar a notificação, por favor tente novamente.');
        }

		function showUserNotificationPopup(){

		}
    }
})();
 