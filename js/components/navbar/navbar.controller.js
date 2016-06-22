(function () {
  'use strict';

  angular.module('YourlsApp')
    .controller('NavbarCtrl', NavbarCtrl);

    function NavbarCtrl($state) {
      var vm = this;

      vm.go = go;

      ///////////////

      function go(state) {
        $state.go(state);
      }
    }
})();
