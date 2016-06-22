(function () {
  'use strict';

  angular.module('YourlsApp')
    .controller("SettingsCtrl", SettingsCtrl);

  function SettingsCtrl($localStorage, $ipc) {
    var vm = this;
    var lsk = 'settings';

    //bindables
    vm.settings = $localStorage.get(lsk, {});
    vm.disabled = false;
    vm.error = {};

    //methods
    vm.save = save;
    vm.checkUrl = checkUrl;

    ////////////

    function checkUrl() {
      if (vm.settings.apiUrl.search(/^(https?):\/\/[^\s/$.?#].[^\s]*$/) !== -1) {
        vm.error.apiUrl = '';
        vm.disabled = false;
      } else {
        vm.error.apiUrl = 'Does not look like a valid URL';
        vm.disabled = true;
      }
    }

    function save() {
      vm.error = {};
      if (!vm.settings.apiUrl) {
        vm.error.apiUrl = 'API URL is required';
      }
      if (!vm.settings.token) {
        vm.error.token = 'Signature Token is required';
      }
      if (Object.keys(vm.error).length > 0) {
        return;
      }

      //if user left yourls-api.php or trailing slash in url
      vm.settings.apiUrl = vm.settings.apiUrl.replace('yourls-api.php', '');
      if (vm.settings.apiUrl.lastIndexOf('/') === vm.settings.apiUrl.length - 1) {
        vm.settings.apiUrl = vm.settings.apiUrl.slice(0, -1);
      }

      $localStorage.set(lsk, vm.settings);
      $ipc.send(lsk, vm.settings);
      vm.error.saved = 'Settings Saved!';
    }
  }
})();
