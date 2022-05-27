(function(){
    'use strict';

    angular
        .module('custom')
        .service('spinnerService', spinnerService);

    spinnerService.$inject = ['$q'];
    function spinnerService ($q) {

        var loadClass = 'whirl ringed'; 
        var zIndex0Class = 'z0';

        this.show = function(selector){
            handleDatePickers(true);

            act(selector, true);
        }

        this.hide = function(selector){
            handleDatePickers(false);

            act(selector, false);
        }

        function handleDatePickers(flag){
            var array = $('smg-date-picker-v2, .btn-group.dropdown.dropdown-list');
            if(array && array.length > 0){   
                angular.forEach(array, (item)=>{
                    if(flag){
                        $(item).addClass(zIndex0Class);
                    }else{
    
                        $(item).removeClass(zIndex0Class);
                    }
                });
            }
        }


        function act(selector, flag){
            var elemArray = $(selector);
            if(elemArray && elemArray.length > 0){
                var firstElem = elemArray[0]; 
                if(flag){
                    $(firstElem).addClass(loadClass);
                }else{
                    $(firstElem).removeClass(loadClass);
                }
            }
        }

    }
})();
