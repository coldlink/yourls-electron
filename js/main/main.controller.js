(function () {
  'use strict';

  angular.module('YourlsApp')
    .controller("MainCtrl", MainCtrl);

  function MainCtrl($localStorage, $ipc, $scope) {
    const validUrl = require("valid-url");
    console.log(validUrl);
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
      if (!validUrl.isUri(vm.url) && vm.settings.validateUrl) {
        vm.error.url = 'URL does not look valid...';
        return;
      }
      $ipc.send('shorten-url', {
        url: vm.url,
        keyword: vm.keyword ? vm.keyword : false
      });
    }
  }
})();
