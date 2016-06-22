(function () {
  'use strict';
  angular.module('YourlsApp')
    .run(run);

  function run($ipc, $localStorage, $state) {
    $ipc.on('redirect', function (e, arg) {
      $state.go(arg);
    });

    $ipc.on('settings', function (e, arg) {
      $localStorage.set('settings', arg);
    });
  }
})();
