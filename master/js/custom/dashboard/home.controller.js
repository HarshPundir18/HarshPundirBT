(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('homeController', homeController);

    homeController.$inject = ['$rootScope', '$state', '$filter', '$element', 'ngDialog',
                                'translationService', 'garsService', 'stockService',
                                'spinnerService', 'oauthService', 'featureFlagService',
                                'dashboardService', 'dateService', 'securityService',
                                'SMG_EGAR_STATUS', 'SMG_LEGAL_DEADLINES_TYPES', 'SOME_CONSTS'];
    function homeController($rootScope, $state, $filter, $element, ngDialog,
                                translationService, garsService, stockService,
                                spinnerService, oauthService, featureFlagService,
                                dashboardService, dateService, securityService,
                                SMG_EGAR_STATUS,
                                SMG_LEGAL_DEADLINES_TYPES,
                                SOME_CONSTS) {
        
        dateService.changeLocalePt();
        var vm = this;
        vm.SMG_EGAR_STATUS = SMG_EGAR_STATUS;
        vm.SMG_LEGAL_DEADLINES_TYPES = SMG_LEGAL_DEADLINES_TYPES;
        vm.SOME_CONSTS = SOME_CONSTS;

        vm.configureDefaultEstablishment = false;
        vm.hasDefaultEstablishment = false;
        vm.lblDashboard = translationService.translate('lbl-dashboard');
        vm.lblOpenEgars = translationService.translate('lbl-openEgars');
        vm.lblTotalEgars = translationService.translate('lbl-totalEgars');
        vm.lblNotifications = translationService.translate("lbl-newNotifications");
        vm.lblLerCodeStockItemsChart = translationService.translate("lbl-lerCodeStockItemsChart");
        vm.lblWaitingAuthorizationEgars = translationService.translate("lbl-waitingAuthorizationEgars");
        vm.lblFinishedEgars = translationService.translate("lbl-finishedEgars");
        vm.lblWarehouseStockQuantity = translationService.translate("lbl-warehouseStockQuantity");
        vm.newNotificationsCount = 0;
        vm.totalEgarsCount = 0;
        vm.openEgarsCount = 0;
        vm.waitingAuthorizationEgarsCount = 0;
        vm.closedEgarsCount = 0;
        vm.lblWarehouseStockQuantityCount = 0;
        vm.checkGpdr = true;

        var loadingSelector = '#main';

        vm.$onInit = function(){
            securityService
                .checkGdpr()
                .then((result)=>{
                    if(!result.data){
                        //show modal
                        vm.dialog = ngDialog.open({
                            template: '/app/custom/security/dialog.gdpr.acceptance.html',
                            className: 'ngdialog-theme-default request request-acceptance',
                            preCloseCallback: preClose,
                            width: 900,
                            showClose: false,
                            controller: 'gdprAcceptanceController as $ctrl',
                            closeByNavigation: false,
                            resolve : {

                            }
                        });
                    }
                });
        };

        var preClose = (arg) =>{ 
            if(!arg){
                return false;
            }

            //from June 8th we don't allow to close GDPR modal unless user accepts 
            if(arg.payload){
                $state.go('app.dashboard');
                return true;
            }

            //false impedes the modal to close
            return false;
        }

        let showGdprRejectMessage = function(){
            //show modal
            vm.dialog = ngDialog.open({
                template: '/app/custom/security/dialog.gdpr.reject.html',
                className: 'ngdialog-theme-default request request-acceptance',
                width: 900,
                showClose: false,
                controller: 'gdprAcceptanceController as $ctrl',
                closeByNavigation: false,
            });
        }

        var shizle = ()=> { console.log('some ES6 shizle'); };

        shizle();

        if(oauthService.hasDefaultEstablishment()){
            vm.hasDefaultEstablishment = true;
        }else{
            vm.configureDefaultEstablishment = true;
        }

        activate();

        vm.list = function(){
          spinnerService.show(loadingSelector);
          $state.go('app.overviewGars');
        }

        vm.new = function(){
          spinnerService.show(loadingSelector);
          $state.go('app.newGarV2');
        }

        vm.configure = function(){
            spinnerService.show(loadingSelector);
            $state.go('app.myEstablishment');
        }

        vm.goToNotifications = function(){
            $state.go('app.userNotificationOverview');
        }

        vm.goToEgarsOverview = function(status){
            $state.go('app.overviewGars', status);
        }

        vm.goToMassVolumes = function(){
            //$state.go('app.warehouseOverview', status);
            $state.go('app.massVolumes');
        }


        vm.goToLegalDeadlines = function(legalDeadlineType){
            console.log(legalDeadlineType)
            $state.go('app.garslegalDeadlinesList', {type: legalDeadlineType})
        }

        //privates
        function activate(){
            setWidgetDate();
            setEgarsStatusCounts();
            setTotalLerCodeStock();
            getLegalDeadlinesCount();
        }

        function getLegalDeadlinesCount(){
            spinnerService.show('legalDeadlines-v2')
            
            dashboardService
                .countLegalDeadlines()
                .then((result)=>{
                    //Old
                    // vm.originToAuthorize = formatEGarsNumber(result.data.OriginToAuthorize);
                    // vm.originToReplyRectification = formatEGarsNumber(result.data.OriginToReplyRectification);
                    // vm.destinToActOnNewEgar = formatEGarsNumber(result.data.DestinToActOnNewEgar);
                    vm.asDestin = formatEGarsNumber(result.data.AsDestin);
                    vm.asOrigin = formatEGarsNumber(result.data.AsOrigin);
                })
                .catch((error)=>{
                    vm.originToAuthorize = '--';
                    vm.originToReplyRectification = '--';
                    vm.destinToActOnNewEgar = '--';
                })
                .finally(()=>{ 
                    spinnerService.hide('legalDeadlines-v2')
                });
        }

        function formatEGarsNumber(number){
            var label = '';
            if(number == 1){
                label = 'e-GAR';
            } else{
                label = 'e-GARs';
            }

            return `${number} ${label}`;
        }

        function setTotalLerCodeStock(){
            stockService
                .getTotalLerCodeStockCount()
                .then(function(result){
                    vm.lblWarehouseStockQuantityCount = result.data.Total
                });
        }

        function setEgarsStatusCounts(){
            garsService
                .getEgarsStatusCount()
                .then(function(result){
                    vm.totalEgarsCount = result.data.Total;
                    vm.openEgarsCount = result.data.Open;
                    vm.waitingAuthorizationEgarsCount = result.data.WaitingAuthorizarion;
                    vm.finishedEgarCount = result.data.Finished
                });
        }

        function setWidgetDate(){
            var date = new Date();
            var monthName = $filter('date')(date, 'MMMM');
            var dayOfWeekName = $filter('date')(date, 'EEEE');

            vm.month = translationService.translateDateStuff(monthName);
            vm.dayOfWeek = translationService.translateDateStuff(dayOfWeekName);
        }

        //callbacks

        //events
        $rootScope.$on('newNotificationEvent', function(event, data){
            vm.newNotificationsCount = data;
        });
    }
})();