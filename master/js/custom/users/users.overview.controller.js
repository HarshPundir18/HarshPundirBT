(function () {
    'use strict';

    angular
        .module('custom')
        .controller('usersOverviewController', usersOverviewController);

    usersOverviewController.$inject = ['$scope', '$compile', '$log', '$state', '$filter', 'ngDialog',
        'userService', 'spinnerService', 'translationService', 'Notify',
        'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder'];
    function usersOverviewController($scope, $compile, $log, $state, $filter, ngDialog,
        userService, spinnerService, translationService, Notify,
        DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder) {

        var vm = this;
        vm.dataTableCurrentStart = null;
        vm.dtInstance = {};
        vm.btnOriginSelected = false;
        vm.btnTransporterSelected = false;
        vm.btnDestinSelected = true;

        vm.pageSize = 10;

        vm.showActionClick = function (establishmentId) {
            $log.info('showActionClick ' + establishmentId);
        }

        vm.editActionClick = function (id) {
            $state.go('app.usersEdit', { id: id })
        }

        vm.deleteActionClick = function (userId) {
            var user = $filter('filter')(vm.dataTableCurrentItems, { 'UniqueId': userId })[0];

            if (!user) {
                return;
            }

            ngDialog.openConfirm({
                className: 'ngdialog-theme-default',
                template: '/app/custom/users/user.delete.dialog.html',
                controller: 'userDialogController',
                resolve: {
                    user: function () { return user; }
                }
            })
            .then(function (value) {
                //console.log('Modal promise resolved SUCCESS. Value: ', value);
                userService.delete(userId).then(userDeleteOnSuccess, userDeleteOnError);
            }, function (reason) {
                //console.log('Modal promise rejected CANCELEd. Reason: ', reason);
            });
        }


        activate();

        ////////////////

        function activate() {

            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());

            vm.dtColumns = [
                DTColumnBuilder.newColumn('UserLoginName', 'Utilizador')
                    .notSortable()
                    .withClass('sorting_disabled')
                    .withClass('dt-center col-sm-2'),
                DTColumnBuilder.newColumn('Email', 'e-Mail')
                    .notSortable()
                    .withClass('dt-center col-sm-1'),
                DTColumnBuilder.newColumn('RoleName', 'Perfil')
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
                    userService.getUsers(dataTable)
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

            if(!model.IsDefault){
                //var actionShow = "<span title='Ver' ng-click=$ctrl.showActionClick('" + model.UniqueId + "')><em class='fa fa-eye'></em></span>";
                var actionEdit = `<span title='Editar' ng-click=$ctrl.editActionClick('${model.UniqueId}')><em class='fa fa-pencil'></em></span>`;
                var actionDelete = `<span title='Remover' ng-click=$ctrl.deleteActionClick('${model.UniqueId}')><em class='fa fa-times'></em></span>`;
            }

            return actionEdit + actionDelete;
        }


        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT 
            $compile(angular.element(row).contents())($scope);
        }


        function userDeleteOnSuccess(result){
            vm.dtInstance.reloadData(null, true);
            Notify.alert( 
                    '<em class="fa fa-check"></em> Utilizador apagado com sucesso!', 
                    { status: 'success'}
                );
        }

        function userDeleteOnError(error){
            Notify.alert( 
                    '<em class="fa fa-times"></em> Não foi possivel apagar Utilizador, por favor tente novamente.', 
                    { status: 'warning'}
                );
        }
    }
})();
