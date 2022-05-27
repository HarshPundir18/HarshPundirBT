
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('generatedDocumentsController', generatedDocumentsController);

        generatedDocumentsController.$inject = ['$scope', '$element', '$timeout'];
    function generatedDocumentsController($scope, $element, $timeout) {

        var vm = this;

        //vm.newDocuments = 10;
        vm.newDocuments = '';
        var limit = 5;
        var count = 0;


        var loadTime = 2000, //Load the data every second
        errorCount = 0, //Counter for the server errors
        loadPromise; //Pointer to the promise created by the Angular $timout service

        vm.generatedDocumentsOpen = false;

        var nextBlink = () =>{
            var loadPromise = $timeout(highlighIcon, 500);   
            count++;
        };

        var highlighIcon = ()=>{
            if(count <= limit){
                $element.addClass('highlight');
                $element.fadeOut(500);
                $element.fadeIn(500);
                nextBlink();
            }else{
                $element.removeClass('highlight');
            }
        }

        $scope.$on('toggleGeneratedDocuments', function ($event, message){
            nextBlink();
        });
    }
})();
