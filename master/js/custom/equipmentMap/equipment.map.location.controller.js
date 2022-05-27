(function () {
  "use strict";

  angular
    .module("custom")
    .controller(
      "equipmentMapLocationController",
      equipmentMapLocationController
    );

  equipmentMapLocationController.$inject = [
    "$state",
    "$scope",
    "$q",
    "$stateParams",
    "equipmentMapLocationService",
    "spinnerService",
    "Notify",
    "ngDialog",
  ];
  function equipmentMapLocationController(
    $state,
    $scope,
    $q,
    $stateParams,
    equipmentMapLocationService,
    spinnerService,
    Notify,
    ngDialog
  ) {
    var vm = this;
    const key = "paZGCS0xjWBz8aaJsPfp";
    vm.equipmentSearched = [];
    vm.marker = [];

    equipmentMapLocationService.getEquipmentsLocation().then(function (result) {
      vm.equipments = result.data.Items;
      vm.addMarker(vm.equipments);
    });

    vm.selectedEquipment = function(equipment){
        if(vm.equipmentSearched.indexOf(equipment) !== -1){
          vm.equipmentSearched.splice(equipment,1);
        }else {
          vm.equipmentSearched.push(equipment);
        }
    }

    vm.onSearchEquipments = function() {
      //show modal
      vm.dialog = ngDialog.open({
        template: "/app/custom/equipmentMap/equipment.search.html",
        className: "ngdialog-theme-default",
        preCloseCallback: preCloseCallback,
        width: 900,
        showClose: true,
        controller: "equipmentMapLocationController as $ctrl",
        scope: $scope,
        closeByNavigation: true,
      });
    };

    var preCloseCallback = (payload) => {
      if (payload != "$closeButton") {
        vm.addMarker(payload);
      }
      return true;
    };

    vm.addMarker = function(equipments) {
      const map = new maplibregl.Map({
        container: "map", // container id
        style: `https://api.maptiler.com/maps/basic/style.json?key=${key}`, // style URL
        center: [-8.10720744154483, 40.392387732842025], // starting position [lng, lat]
        zoom: 9, // starting zoom
      });
  
      var nav = new maplibregl.NavigationControl();
      map.addControl(nav, "top-left");
  
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );
      vm.marker = [];
      equipments.map((equipment, i) => {
        vm.marker[i] = new maplibregl.Marker()
        .setLngLat([equipment.DeliveryLongitude, equipment.DeliveryLatitude])
        .setPopup(
          new maplibregl.Popup().setHTML(
            equipment.ExternalId + "<br />" + equipment.Name
          )
        )
        .addTo(map);
      });
      if(vm.marker.length == 1){
        map.jumpTo({center: [vm.marker[0]._lngLat.lng, vm.marker[0]._lngLat.lat]});
      }
    }
    
  }

})();
