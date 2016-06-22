(function () {
  'use strict';

  angular.module('YourlsApp')
    .controller("SettingsCtrl", SettingsCtrl);

  function SettingsCtrl() {
    var vm = this;

    vm.heading = 'Settings';
    vm.changeApiUrl = changeApiUrl;

    ////////////

    function changeApiUrl() {
      console.log(vm.apiUrl)
    }
  }
})();
