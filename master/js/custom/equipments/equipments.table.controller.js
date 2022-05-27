(function () {
  "use strict";

  angular
    .module("custom")
    .controller("equipmentsTableController", equipmentsTableController);

  equipmentsTableController.$inject = [
    "$scope",
    "$compile",
    "$log",
    "$http",
    "$state",
    "$filter",
    "ngDialog",
    "equipmentService",
    "spinnerService",
    "translationService",
    "Notify",
    "DTDefaultOptions",
    "DTOptionsBuilder",
    "DTColumnBuilder",
  ];
  function equipmentsTableController(
    $scope,
    $compile,
    $log,
    $http,
    $state,
    $filter,
    ngDialog,
    equipmentService,
    spinnerService,
    translationService,
    Notify,
    DTDefaultOptions,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTColumnDefBuilder
  ) {
    var vm = this;
    console.log("equipmentTableController");
    spinnerService.show("#main");
    equipmentService
      .getEquipments()
      .then(
        function (data) {
          vm.equipments = data.data.Items;
        },
        function (error) {}
      )
      .finally(function () {
        spinnerService.hide("#main");
      });

    vm.editActionClick = function (equipmentId) {
      $state.go("app.editEquipment", { equipmentId: equipmentId });
    };

    vm.deleteActionClick = function (equipmentData) {
      vm.equipment = equipmentData;
      //show modal
      vm.dialog = ngDialog.open({
        template: "/app/custom/equipments/delete.equipment.html",
        className: "ngdialog-theme-default",
        preCloseCallback: preCloseCallback,
        width: 900,
        showClose: true,
        controller: "equipmentsTableController as $ctrl",
        scope: $scope,
        closeByNavigation: true,
      });
    };

    var preCloseCallback = (payload) => {
      if (payload == 'delete') {
        equipmentService
          .deleteEquipment(vm.equipment.Id)
          .then(equipmentDeleteOnSuccess, equipmentDeleteOnError)
          .finally($state.reload());
      }
      return true;
    };

    function equipmentDeleteOnSuccess(result) {
      // equipmentService.getEquipments().then(function (data) {
      //   vm.equipments = data.data.Items;
      // });
      Notify.alert(
        '<em class="fa fa-check"></em> Estabelecimento cliente apagado com sucesso!',
        { status: "success" }
      );
    }

    function equipmentDeleteOnError(error) {
      Notify.alert(
        '<em class="fa fa-times"></em> Não foi possivel agar Estabelecimento cliente, por favor tente novamente.',
        { status: "warning" }
      );
    }

    vm.onClearFiltersClick = function () {
      angular.element(".tableFilter").each(function (item) {
        this.value = null;
      });
    };

    vm.onSearchClick = function () {
      // vm.dtInstance.reloadData(null, true);
    };
  }
})();
