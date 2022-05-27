(function() {
    'use strict';

    // usage
    //<a class="list-group-item"  ng-click="vm.onExportReportClick('csv')" export-to-csv>
    //

    angular.module('custom')
        .directive('exportToCsv', function () { //a directive to 'enter key press' in elements with the "ng-enter" attribute

        return function (scope, element, attrs) {

            element.bind("keydown keypress", function (event) {

                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
})


    angular.module('custom')
        .directive('exportToCsv', function(){

            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var el = element[0];
                    element.bind('click', function(e){
                        var table = e.target.nextElementSibling;
                        var csvString = '';
                        for(var i=0; i<table.rows.length;i++){
                            var rowData = table.rows[i].cells;
                            for(var j=0; j<rowData.length;j++){
                                csvString = csvString + rowData[j].innerHTML + ",";
                            }
                            csvString = csvString.substring(0,csvString.length - 1);
                            csvString = csvString + "\n";
                        }
                        csvString = csvString.substring(0, csvString.length - 1);
                        var a = $('<a/>', {
                            style:'display:none',
                            href:'data:application/octet-stream;base64,'+btoa(csvString),
                            download:'emailStatistics.csv'
                        }).appendTo('body')
                        a[0].click()
                        a.remove();
                    });
                }
            }
	    });


})();
 

