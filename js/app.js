// App init
(function () {
  'use strict';

  angular.module('YourlsApp', ['ngMaterial', 'ui.router', 'ngMdIcons'])
    .config(config);

  function config($urlRouterProvider) {
    $urlRouterProvider
			.otherwise('/');
  }
})();
