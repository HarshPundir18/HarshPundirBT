/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$rootScope', '$scope', '$log', '$state', '$filter',
        'spinnerService', 'SidebarLoader', 'Utils', 'translationService'];
    function SidebarController($rootScope, $scope, $log, $state, $filter,
        spinnerService, SidebarLoader, Utils, translationService) {

        var vm = this;

        activate();

        function activate() {

            var collapseList = [];
            // demo: when switch from collapse to hover, close all items
            $rootScope.$watch('app.layout.asideHover', function (oldVal, newVal) {
                if (newVal === false && oldVal === true) {
                    closeAllBut(-1);
                }
            });

            spinnerService.show('.sidebar');
            SidebarLoader
                .getMenu()
                .then(sidebarReady)
                .catch(sidebarReadyError)
                .finally(function () {
                    spinnerService.hide('.sidebar');
                });


            translateHelloWorld();

            function sidebarReadyError(err, status) {

            }

            function translateHelloWorld() { 
                var x = $filter('translate')('HELLO_WORLD'); 
                console.log(x);
            }

            function sidebarReady(result) {

                $scope.menuItems = [];

                var items = result.data;

                for (var i = 0; i < items.length; i++) {
                    var item = items[i];

                    var menuItem = {};
                    menuItem.text = item.Name;
                    if (item.ChildMenuItems && item.ChildMenuItems.length > 0) {
                        menuItem.submenu = handleSubMenus(item.ChildMenuItems);
                    }

                    if (menuItem.text === 'menu-dashboard') {
                        menuItem.sref = 'app.dashboard';
                        menuItem.icon = 'icon-speedometer';
                        //menuItem.alert = '3';
                        menuItem.label = 'label label-info';
                        menuItem.translate = 'sidebar.nav.DASHBOARD';
                    } else if (menuItem.text === 'menu-createDefaulEstablishment') {
                        menuItem.sref = 'app.myEstablishment';
                        menuItem.icon = 'fa fa-bank';
                        menuItem.label = 'label label-info';
                    } else if (menuItem.text === 'menu-defaulEstablishment') {
                        menuItem.sref = 'app.myEditEstablishment';
                        menuItem.icon = 'fas fa-warehouse';
                        //menuItem.alert = '3';
                        menuItem.label = 'label label-info';
                    } else if (menuItem.text === 'menu-clients') {
                        menuItem.icon = 'fa fa-building';
                        //menuItem.alert = '3';
                        menuItem.label = 'label label-info';
                    } else if (menuItem.text === 'menu-agreements') {
                        menuItem.sref = '#';
                        menuItem.icon = 'fa fa-briefcase';
                        //menuItem.alert = '3';  
                    } else if (menuItem.text === 'menu-agenda') {
                        menuItem.sref = '#';
                        menuItem.icon = 'fa fa-calendar';
                        //menuItem.alert = '3';
                    } else if (menuItem.text == 'menu-egars') {
                        //menuItem.sref = 'app.overviewGars';
                        menuItem.icon = 'icon-list';
                        //menuItem.alert = '3';
                    } else if (menuItem.text === 'menu-support') {
                        menuItem.sref = 'app.support';
                        menuItem.icon = 'fa fa-support';
                        //menuItem.alert = '3';
                    } else if (menuItem.text === 'menu-mass-volumes') {
                        menuItem.icon = 'fa fa-cubes';
                    } else if (menuItem.text === 'menu-settings') {
                        menuItem.sref = 'app.appSettings';
                        menuItem.icon = 'fa fa-gears';
                    } else if (menuItem.text === 'menu-super-admin') {
                        menuItem.sref = 'app.dashboard';
                        menuItem.icon = 'fa fa-diamond';
                    } else if (menuItem.text === 'menu-operation') {
                        //menuItem.sref = 'app.myEstablishmentsOverview';
                        menuItem.icon = 'fa fa-bank';
                    } else if (menuItem.text === 'menu-reports') {       
                        menuItem.sref = 'app.genericReports';
                        //menuItem.sref = 'app.reports';
                        menuItem.icon = 'fa fa-book';
                    } else if (menuItem.text === 'menu-reportsHub') {       
                        menuItem.sref = 'app.reportsHub';
                        menuItem.icon = 'fa fa-book';
                    } else if (menuItem.text === 'menu-other-docs') {
                        menuItem.icon = 'fa fa-clipboard';
                    } else if (menuItem.text === 'menu-egar-archive') {
                        menuItem.icon = 'fa fa-archive';
                    } else if (menuItem.text === 'menu-product-codes') {
                        menuItem.icon = 'fa fa-tags';
                    } else if (menuItem.text === 'menu-users') {
                        menuItem.icon = 'fa fa-user';
                        menuItem.sref = 'app.usersOverview';
                    } else if (menuItem.text === 'menu-equipments') {
                        menuItem.icon = 'fa fa-database';
                    }

                    menuItem.label = 'label label-info';

                    //menuItem.translate = 'sidebar.nav.DASHBOARD';
                    menuItem.translate = translationService.translate(menuItem.text); //menu text
                    menuItem.text = translationService.translate(menuItem.text);      //menu title (tooltip)

                    $scope.menuItems.push(menuItem);
                }
            }

            // Handle sidebar and collapse items
            // ----------------------------------

            $scope.getMenuItemPropClasses = function (item) {
                return (item.heading ? 'nav-heading' : '') +
                    (isActive(item) ? ' active' : '');
            };

            $scope.addCollapse = function ($index, item) {
                collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
            };

            $scope.isCollapse = function ($index) {
                return (collapseList[$index]);
            };

            $scope.toggleCollapse = function ($index, isParentItem) {

                // collapsed sidebar doesn't toggle drodopwn
                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {
                    return true;
                }

                // make sure the item index exists
                if (angular.isDefined(collapseList[$index])) {
                    if (!$scope.lastEventFromChild) {
                        collapseList[$index] = !collapseList[$index];
                        closeAllBut($index);
                    }
                }
                else if (isParentItem) {
                    closeAllBut(-1);
                }

                $scope.lastEventFromChild = isChild($index);

                return true;
            };

            // Check item and children active state
            function isActive(item) {

                if (!item) return;

                if (!item.sref || item.sref === '#') {
                    var foundActive = false;
                    angular.forEach(item.submenu, function (value) {
                        if (isActive(value)) foundActive = true;
                    });
                    return foundActive;
                }
                else
                    return $state.is(item.sref) || $state.includes(item.sref);
            }

            function closeAllBut(index) {
                index += '';
                for (var i in collapseList) {
                    if (index < 0 || index.indexOf(i) < 0)
                        collapseList[i] = true;
                }
            }

            function isChild($index) {
                /*jshint -W018*/
                return (typeof $index === 'string') && !($index.indexOf('-') < 0);
            }

            function startsWith(str, strTest) {
                return (str.indexOf(strTest) === 0);
            }

            function handleSubMenus(childMenuItems) {
                var subMenuItems = [];
                angular.forEach(childMenuItems, function (childMenuItem) {
                    var subMenuItem = {};
                    subMenuItem.translate = translationService.translate(childMenuItem.Name); //menu text
                    subMenuItem.text = translationService.translate(childMenuItem.Name);      //menu title (tooltip)

                    if (childMenuItem.Name === 'menu-egars-new') {
                        subMenuItem.sref = 'app.newGarV2';
                    } else if (childMenuItem.Name === 'menu-egars-import') {
                        subMenuItem.sref = 'app.importGars';
                    } else if (childMenuItem.Name === 'menu-egars-list') {
                        subMenuItem.sref = 'app.overviewGars';
                    } else if (childMenuItem.Name === 'menu-egars-batch-acceptance') {
                        subMenuItem.sref = 'app.batchAcceptance';
                    } else if (childMenuItem.Name === 'menu-egars-batch-accept-rectification') {
                        subMenuItem.sref = 'app.batchAcceptRectificationList';
                    } else if (childMenuItem.Name === 'menu-other-docs-rcd-anexo3') {
                        subMenuItem.sref = 'app.otherDocsAnexo3';
                    } else if (childMenuItem.Name === 'menu-other-docs-exsitu-quantities'){
                        subMenuItem.sref = 'app.otherDocsExSituQuantities';
                    } else if(childMenuItem.Name == 'menu-other-docs-general-quantities'){
                        subMenuItem.sref = 'app.otherDocsGeneralQuantities';
                    } else if (childMenuItem.Name === 'menu-pickupPoints') {
                        subMenuItem.sref = 'app.pickupPointsList';
                    } else if (childMenuItem.Name === 'menu-userEstablishments') {
                        subMenuItem.sref = 'app.establishmentOverview';
                    }  else if (startsWith(childMenuItem.Name, 'menu-egar-archive')) {
                        subMenuItem.sref = 'app.egarArchive';
                        subMenuItem.params = { year: childMenuItem.Parameter };
                    } else if (childMenuItem.Name === 'menu-product-list') {
                        subMenuItem.sref = 'app.productsList';
                    } else if (childMenuItem.Name === 'menu-product-new') {
                        subMenuItem.sref = 'app.productsNew';
                    } else if (childMenuItem.Name === 'menu-product-group-list') {
                        subMenuItem.sref = 'app.productGroupList';
                    } else if (childMenuItem.Name === 'menu-product-group-new') {
                        subMenuItem.sref = 'app.productGroup';
                    } else if (startsWith(childMenuItem.Name, 'menu-mass-volumes')) {
                        subMenuItem.sref = 'app.massVolumes';
                        subMenuItem.params = { year: childMenuItem.Parameter };
                    } else if (childMenuItem.Name === 'menu-defaulEstablishments') {
                        subMenuItem.sref = 'app.myEstablishmentsOverview';
                    } else if (childMenuItem.Name === 'menu-service-areas') {
                        subMenuItem.sref = 'app.serviceAreasOverview';
                    } else if (childMenuItem.Name === 'menu-import-pickupPoints') {
                        subMenuItem.sref = 'app.pickupPointsImport';
                    }  else if (childMenuItem.Name === 'menu-egars-sync') {
                        subMenuItem.sref = 'app.egarsSync';
                    } else if(childMenuItem.Name === 'menu-vehicles'){
                        subMenuItem.sref = 'app.vehiclesOverview';
                    } else if (childMenuItem.Name === 'menu-equipment-list'){
                        subMenuItem.sref = 'app.equipments';
                    } else if (childMenuItem.Name === 'menu-equipment-create'){
                        subMenuItem.sref = 'app.equipmentNew';
                    } else if (childMenuItem.Name === 'menu-equipment-collection'){
                        subMenuItem.sref = 'app.newEquipmentCollection';
                    } else if (childMenuItem.Name === 'menu-equipment-delivery'){
                        subMenuItem.sref = 'app.newEquipmentDelivery';
                    } else if (childMenuItem.Name === 'menu-equipment-map'){
                        subMenuItem.sref = 'app.equipmentMapLocation';
                    }
                    
                    subMenuItems.push(subMenuItem);
                });
                return subMenuItems;
            }
        } // activate

        $rootScope.$on('reloadMenus', function (event, data) {
            activate();
        });
    }

})();
