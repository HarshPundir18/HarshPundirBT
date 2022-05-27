(function() {
    'use strict';

    angular
        .module('custom')
        .controller('warehouseOverviewController', warehouseOverviewController);

    warehouseOverviewController.$inject = ['$window', '$rootScope', '$scope', '$compile', '$http', '$state', '$filter',
                                    'garsService', 'stockService', 'translationService', 'utilsService'];
    function warehouseOverviewController($window, $rootScope, $scope, $compile, $http, $state, $filter,
                                    garsService, stockService, translationService, utilsService) {
        
        //VM stuff
        var vm = this;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];


        

        // vm.nvd3Data = [
        //     {
        //         key: "Cumulative Return",
        //         values: [
        //             {
        //                 "label" : "150101" ,
        //                 "value" : -29.765957771107,
        //                 "title": "asdasda"
        //             } ,
        //             {
        //                 "label" : "B" ,
        //                 "value" : 0
        //             } ,
        //             {
        //                 "label" : "C" ,
        //                 "value" : 32.807804682612
        //             } ,
        //             {
        //                 "label" : "D" ,
        //                 "value" : 196.45946739256
        //             } ,
        //             {
        //                 "label" : "E" ,
        //                 "value" : 0.19434030906893
        //             } ,
        //             {
        //                 "label" : "F" ,
        //                 "value" : -98.079782601442
        //             } ,
        //             {
        //                 "label" : "G" ,
        //                 "value" : -13.925743130903
        //             } ,
        //             {
        //                 "label" : "H" ,
        //                 "value" : -5.1387322875705
        //             },
        //             {
        //                 "label" : "I" ,
        //                 "value" : 0.19434030906893,
        //             } ,
        //             {
        //                 "label" : "J" ,
        //                 "value" : -98.079782601442
        //             } ,
        //             {
        //                 "label" : "K" ,
        //                 "value" : -13.925743130903
        //             } ,
        //             {
        //                 "label" : "L" ,
        //                 "value" : -5.1387322875705
        //             },
        //             {
        //                 "label" : "M" ,
        //                 "value" : 0.19434030906893
        //             } ,
        //             {
        //                 "label" : "N" ,
        //                 "value" : -98.079782601442
        //             } ,
        //             {
        //                 "label" : "O" ,
        //                 "value" : -13.925743130903
        //             } ,
        //             {
        //                 "label" : "P" ,
        //                 "value" : -5.1387322875705
        //             },
        //         ]
        //     }
        // ]

        //
        activate();

        //CALLBACKS
        function getLerCodeStockOnSuccess(result){
            if(result.data){
                angular.forEach(result.data, function(item) {
                    vm.nvd3Data[0].values.push({
                        "label": item.LerCode,
                        "value": item.Quantity
                    });
                });
                
            }
        }

        //PRIVATES
        function activate(){
            configureBarChart();

            stockService
                .getLerCodeStock()
                .then(getLerCodeStockOnSuccess);
        }

        function configureBarChart(){
            vm.nvd3Options = {
                chart: {
                    type: 'discreteBarChart',
                    height: 450,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 50,
                        left: 55
                    },
                    staggerLabels:false,
                    x: function(d){return d.label;},
                    y: function(d){return d.value + (1e-10);},
                    showValues: true,                           //...instead, show the bar value right on top of each bar.
                    tooltips: false,
                    valueFormat: function(d){
                        return d3.format(',.2f')(d);
                    },
                    duration: 500,
                    xAxis: {
                        axisLabel: translationService.translate("lbl-lerCodes")
                    },
                    yAxis: {
                        axisLabel: translationService.translate("lbl-quantities"),
                        axisLabelDistance: -10
                    }
                }
            };

            vm.nvd3Data = [
                {
                    key: "Cumulative Return",
                    values: []
                }
            ]
        }

        //SCOPE stuff
    }
})();