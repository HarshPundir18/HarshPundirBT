(function(){
    'use strict';

    angular
        .module('custom')
        .service('browserService', browserService);

    browserService.$inject = ['$http'];
    function browserService ($http) {

        var _firefox = function firefox() {
            return (/(?=.*Firefox)/ig).test(navigator.userAgent);
        }

        var _ie = function ie() {
                 return (/(?=.*MSIE)|(?=.*Trident)/ig).test(navigator.userAgent);
        };

        this.firefox = _firefox;
        this.ie = _ie;

        // return {
        //     android: function android() {
        //         return (/Android/i).test(navigator.userAgent);
        //     },
        //     blackBerry: function blackBerry() {
        //         return (/BlackBerry/i).test(navigator.userAgent);
        //     },
        //     iOS: function iOS() {
        //         return (/iPhone|iPad|iPod/i).test(navigator.userAgent);
        //     },
        //     windows: function windows() {
        //         return (/IEMobile/i).test(navigator.userAgent);
        //     },
        //     windows8: function windows8() {
        //         return (/Windows NT 6\.2/i).test(navigator.userAgent);
        //     },
        //     mobile: function mobile() {
        //         return (this.android() || this.blackBerry() || this.iOS() || this.windows());
        //     },
        //     touch: function touch() {
        //         return Modernizr.touch;
        //     },
        //     html5Date: function html5Date() {
        //         return Modernizr.inputtypes.date;
        //     },
        //     mac: function mac() {
        //         return (/Mac/i).test(navigator.platform);
        //     },
        //     chrome: function chrome() {
        //         return (/(?=.*Chrome)(^(?!.*Chromium).*$)/ig).test(navigator.userAgent);
        //     },
        //     firefox: function firefox() {
        //         return (/(?=.*Firefox)/ig).test(navigator.userAgent);
        //     },

        //     safari: function safari() {
        //         return (/(?=.*Safari)(^(?!.*Chromium))(^(?!.*Chrome))/ig).test(navigator.userAgent);
        //     },
        //     edge: function edge() {
        //         return (/(?=.*Edge)/ig).test(navigator.userAgent);
        //     }
        // };
    }
})();
