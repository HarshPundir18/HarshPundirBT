
(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garsOverviewController', garsOverviewController);

    garsOverviewController.$inject = ['$state', '$log', '$stateParams', 'SMG_LEGAL_DEADLINES_TYPES', 'FileUploader'];
    function garsOverviewController($state, $log, $stateParams, SMG_LEGAL_DEADLINES_TYPES, FileUploader) {

        var vm = this;
        vm.SMG_LEGAL_DEADLINES_TYPES = SMG_LEGAL_DEADLINES_TYPES;

        // if($state.current.name === 'app.garslegalDeadlinesList'){
        //     vm.isGarslegalDeadlinesList = true;
        //     vm.isGarsList = false;
        // }else{
        //     vm.isGarslegalDeadlinesList = false;
        //     vm.isGarsList = true;
        // }

        activate();

        ////////////////

        function activate() {
        //   $log.log('I\'m a line from garsOverviewController.js');

        //   var uploader = vm.uploader = new FileUploader({
        //         url: 'http://localhost:38682/api/file'
        //     });

        //   // FILTERS

        //   uploader.filters.push({
        //       name: 'customFilter',
        //       fn: function(/*item, options*/) {
        //           return this.queue.length < 10;
        //       }
        //   });

        //   // CALLBACKS

        //   uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        //       console.info('onWhenAddingFileFailed', item, filter, options);
        //   };
        //   uploader.onAfterAddingFile = function(fileItem) {
        //       console.info('onAfterAddingFile', fileItem);
        //   };
        //   uploader.onAfterAddingAll = function(addedFileItems) {
        //       console.info('onAfterAddingAll', addedFileItems);
        //   };
        //   uploader.onBeforeUploadItem = function(item) {
        //       console.info('onBeforeUploadItem', item);
        //   };
        //   uploader.onProgressItem = function(fileItem, progress) {
        //       console.info('onProgressItem', fileItem, progress);
        //   };
        //   uploader.onProgressAll = function(progress) {
        //       console.info('onProgressAll', progress);
        //   };
        //   uploader.onSuccessItem = function(fileItem, response, status, headers) {
        //       console.info('onSuccessItem', fileItem, response, status, headers);
        //   };
        //   uploader.onErrorItem = function(fileItem, response, status, headers) {
        //       console.info('onErrorItem', fileItem, response, status, headers);
        //   };
        //   uploader.onCancelItem = function(fileItem, response, status, headers) {
        //       console.info('onCancelItem', fileItem, response, status, headers);
        //   };
        //   uploader.onCompleteItem = function(fileItem, response, status, headers) {
        //       console.info('onCompleteItem', fileItem, response, status, headers);
        //   };
        //   uploader.onCompleteAll = function() {
        //       console.info('onCompleteAll');
        //   };

        }

        vm.newGar = function(){
            $state.go('app.newGar');
        }
    }
})();
