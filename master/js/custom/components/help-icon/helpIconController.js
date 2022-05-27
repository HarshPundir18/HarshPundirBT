(function () {
    'use strict';

    var component = {
        templateUrl: '/app/custom/components/help-icon/help-icon.html',
        controller: 'HelpIconComponentController as $ctrl',
        bindings: {
            helpTitle: '@',
            helpText: '@',
            isHtml:'<'
        },

    };

    angular
        .module('custom')
        .component('smgHelpIcon', component);

    angular
        .module('custom')
        .controller('HelpIconComponentController', HelpIconComponentController);

    function HelpIconComponentController($scope) {
        var vm = this;
    }
})();