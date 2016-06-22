(function () {
  'use strict';

  angular.module('YourlsApp')
    .factory('$localStorage', localStorageService);

  function localStorageService($window) {
    var service = {
      set: set,
      get: get
    };
    return service;

    ///////////////

    function set(k, v) {
      if (angular.isObject(v)) {
        v = JSON.stringify(v);
      }
      $window.localStorage[k] = v;
    }

    function get(k, d) {
      try {
        return JSON.parse($window.localStorage[k]);
      } catch (err) {
        return $window.localStorage[k] || d || undefined;
      }
    }
  }
})();
