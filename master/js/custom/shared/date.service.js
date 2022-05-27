(function(){
    'use strict';

    angular
        .module('custom')
        .service('dateService', dateService);

    dateService.$inject = ['$rootScope', 'tmhDynamicLocale', '$locale'];
    function dateService ($rootScope, tmhDynamicLocale, $locale) {
      
        function FomatTwoDigist(number){
            let formattedNumber = number.toLocaleString('pt-PT', {
                minimumIntegerDigits: 2,
                useGrouping: false
              });
            
            return formattedNumber;
        }

        var _changeLocalePt = function(){
            var code = 'pt';
            
            $rootScope.changeLocale = tmhDynamicLocale.set(code);
            $rootScope.$locale = $locale;
            $rootScope.changeLocale = tmhDynamicLocale.set;
        };

        var _getDate = function(date){
            if(!date){
                date = new Date();
            }
            var dd = date.getDate();
            var mm = date.getMonth() + 1; //January is 0!
            var yyyy = date.getFullYear();
            return new Date(`${yyyy}-${mm}-${dd}`);
        };

        var _toFormatedString = function(date){
            if(!date){
                date = new Date();
            }
            var dd = date.getDate();
            var mm = date.getMonth() + 1; //January is 0!
            var yyyy = date.getFullYear();
            return `${yyyy}-${FomatTwoDigist(mm)}-${FomatTwoDigist(dd)}`
        };

        var _sumMonths = function(date, months){
            var resultDate = _getDate(date);
            resultDate.setMonth(resultDate.getMonth() + months);
            return resultDate;
        };
        
        var _getDaysDiff =  function(date1, date2) {
            var dt1 = new Date(date1);
            var dt2 = new Date(date2);
            return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
        }

        var _isValidDate = function(obj){
            return obj != null && obj != undefined && new Date(obj) != "Invalid Date";
        }

        var _getNumberOfDaysInYear = (year) => {
            if ( ( year % 4 == 0 && year % 100 != 0 ) || (year % 400 == 0) ) { 
                //bissexto
                return 366;
            } else {
                return 365;
            }
        }


        this.getNumberOfDaysInYear = _getNumberOfDaysInYear;
        this.toFormatedString = _toFormatedString;
        this.getDate = _getDate;
        this.changeLocalePt = _changeLocalePt;
        this.sumMonths = _sumMonths;
        this.getDaysDiff = _getDaysDiff;
        this.isValidDate = _isValidDate;
    }
})();
