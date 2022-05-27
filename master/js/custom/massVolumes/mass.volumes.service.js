(function(){
    'use strict';

    angular
        .module('custom')
        .service('massVolumesService', massVolumesService);

    massVolumesService.$inject = ['$http', '$q', '$log', '$state', '$location', 'localStorageService'];
    function massVolumesService ($http, $q, $log, $state, $location, localStorageService) {

        var baseUrl = '/api/massVolumes';

        var _getMassVolumesMock = function(){
            return [
                    {
                        Name: "Estab 1",
                        ApaCode: "APAjkhjshfjsdh",
                        Vat: "465654645",
                        Id: "12312312312",
                        MassVolumes: [
                            {
                                LerCode: "111111",
                                In: 12.4,
                                Out: 54.6
                            },
                            {
                                LerCode: "222222",
                                In: 127.4,
                                Out: 44.1
                            },
                            {
                                LerCode: "333333",
                                In: 53.9,
                                Out: 442.1
                            }
                        ]
                    },
                    {
                        Name: "Estab 2",
                        ApaCode: "APAjkhjshfjsdh",
                        Vat: "465654645",
                        Id: "12312312312",
                        MassVolumes: [
                            {
                                LerCode: "111111",
                                In: 12.4,
                                Out: 54.6
                            },
                            {
                                LerCode: "222222",
                                In: 127.4,
                                Out: 44.1
                            },
                            {
                                LerCode: "333333",
                                In: 53.9,
                                Out: 442.1
                            }
                        ]
                    },
                    {
                        Name: "Estab 3",
                        ApaCode: "",
                        Vat: "45646456",
                        Id: "12312312312",
                        MassVolumes: [
                            {
                                LerCode: "111111",
                                In: 12.4,
                                Out: 54.6
                            },
                            {
                                LerCode: "222222",
                                In: 127.4,
                                Out: 44.1
                            },
                            {
                                LerCode: "333333",
                                In: 53.9,
                                Out: 442.1
                            }
                        ]
                    },

                ]
        }

        var _getMassVolumes = function(year){
            return $http.get(`${baseUrl}/${year}`);
        }

        this.getMassVolumes = _getMassVolumes;
    }
})();
