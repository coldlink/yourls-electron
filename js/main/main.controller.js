(function () {
  'use strict';

  angular.module('YourlsApp')
    .controller("MainCtrl", MainCtrl);

  function MainCtrl() {
    var vm = this;
    vm.heading = 'Home Page';
  }
})();
