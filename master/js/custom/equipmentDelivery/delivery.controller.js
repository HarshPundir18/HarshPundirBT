(function () {
  "use strict";

  angular.module("custom").controller("deliveryController", deliveryController);

  deliveryController.$inject = [
    "$state",
    "$filter",
    "$scope",
    "$q",
    "$stateParams",
    "utilsService",
    "deliveryService",
    "spinnerService",
    "Notify",
    "ngDialog",
    "SMG_ESTABLISHMENT_TYPES",
  ];
  function deliveryController(
    $state,
    $filter,
    $scope,
    $q,
    $stateParams,
    utilsService,
    deliveryService,
    spinnerService,
    Notify,
    ngDialog,
    SMG_ESTABLISHMENT_TYPES
  ) {
    var vm = this;
    const key = "paZGCS0xjWBz8aaJsPfp";
    vm.accessInvalidMsg = null;
    vm.accessInvalid = true;

    vm.SMG_ESTABLISHMENT_TYPES = SMG_ESTABLISHMENT_TYPES;
    vm.selectedOriginKey = null;

    vm.serverValidationErrors = [];

    getEquipments();

    function getEquipments() {
      spinnerService.show(".form-horizontal");
      deliveryService.getNonDeliveredEquipments().then(function (result) {
        vm.equipment = result.data.Items;
        if (vm.equipment) {
          spinnerService.hide(".form-horizontal");
        }
      });
    }

    vm.validateInput = function (name, type) {
      var input = vm.formValidate[name];

      var errorType = input.$error[type];

      return (input.$dirty || vm.submitted) && errorType;
    };

    vm.submitted = false;

    // Submit form
    vm.submitForm = function () {
      vm.submitted = true;
      if (
        vm.formValidate.$valid &&
        !this.shouldShowEstablishmentSelecterError()
      ) {
        var data = {};
        data.SearchedEstablishmentId = vm.selectedOrigin
          ? vm.selectedOrigin.uniqueId
          : null;
        data.EquipmentIds = vm.equipmentsIds.map((e) => {
          return e.Id;
        });
        data.Latitude = vm.latitude;
        data.Longitude = vm.longitude;
        data.DocumentNumber = vm.documentNumber;
        data.Notes = vm.notes;

        spinnerService.show(".panel-body");

        deliveryService
          .create(data)
          .then(createDeliveryOnSuccess, createDeliveryOnError)
          .finally(spinnerService.hide(".panel-body"));
      } else {
        utilsService.notifyInvalidFormValidation();
        return false;
      }
    };

    vm.cancel = function () {
      $state.go("app.dashboard");
    };

    function createDeliveryOnSuccess(result) {
      $state.go("app.dashboard");
      Notify.alert('<em class="fa fa-check"></em> Estabelecimento criado!', {
        status: "success",
      });
    }

    function createDeliveryOnError(error, status) {
      vm.serverValidationErrors = utilsService.parseErrors(
        error.data._validationErrors
      );
      vm.serverApplicationErrors = utilsService.parseErrors(
        error.data._applicationErrors
      );

      if (
        (error.data._validationErrors &&
          error.data._validationErrors.length > 0) ||
        (error.data._applicationErrors &&
          error.data._applicationErrors.length > 0)
      ) {
        Notify.alert(
          '<em class="fa fa-times"></em> Existem erros de validação, por favor confira o formulário.',
          { status: "warning" }
        );
      }

      var notificationErrorMessage = "";
      var externalErrors = error.data._externalErrors;
      if (externalErrors) {
        utilsService.parseAndNotifyExternalErrors(externalErrors);
        ngDialog.close();
      }
    }

    vm.shouldShowEstablishmentSelecterError = function () {
      var result =
        vm.submitted &&
        (vm.selectedOrigin == null || vm.selectedOrigin == undefined);
      return result;
    };

    //Map for select address

    const map = new maplibregl.Map({
      container: "map", // container id
      style: `https://api.maptiler.com/maps/basic/style.json?key=${key}`, // style URL
      center: [-8.5607918, 39.4301247], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    var nav = new maplibregl.NavigationControl();
    map.addControl(nav, "bottom-left");

    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    var geocoder = new maptiler.Geocoder({
      input: 'search',
      key: 'paZGCS0xjWBz8aaJsPfp'
    });
    geocoder.on('select', function(item) {
      vm.longitude = item.geometry.coordinates[0];
      vm.latitude = item.geometry.coordinates[1];
      document.getElementById('inp-longitude').focus();
      document.getElementById('inp-longitude').blur();
      map.fitBounds(item.bbox);
      map.getSource('search-results').setData(item);
    });
  }
})();
