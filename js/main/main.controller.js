(function () {
  'use strict';

  angular.module('YourlsApp')
    .controller("MainCtrl", MainCtrl);

  function MainCtrl($localStorage, $ipc, $scope) {
    var vm = this;
    var lsk = 'settings';

    //bindables
    vm.settings = $localStorage.get(lsk, {});
    vm.disabled = false;
    vm.error = {};
    vm.shorten = shorten;
    vm.copyToClipboard = copyToClipboard;

    if (!vm.settings.validateUrl) {
      vm.settings.validateUrl = true;
      $localStorage.set(lsk, vm.settings);
      $ipc.send(lsk, vm.settings);
    }


    //ipc listener
    $ipc.on('yourls-response', function (e, arg) {
      vm.error.shortenUrl = '';
      vm.shortenUrl = arg.shorturl;
      vm.error.shortenUrl = arg.message;
      $scope.$apply();
    });

    //methods
    function copyToClipboard() {
        require('electron').clipboard.writeText(vm.shortenUrl);
    }

    function shorten() {
      if (!vm.url) {
        vm.error.url = 'URL to shorten is required.';
        return;
      }
      if (!validateUrl(vm.url) && vm.settings.validateUrl) {
        vm.error.url = 'URL does not look valid...';
        return;
      }
      $ipc.send('shorten-url', {
        url: vm.url,
        keyword: vm.keyword ? vm.keyword : false
      });
    }

    function validateUrl(value) {
      return /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
    }
  }
})();
