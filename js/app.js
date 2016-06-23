// App init
(function() {
	'use strict';

	angular.module('YourlsApp', ['ngMaterial', 'ui.router', 'ngMdIcons'])
		.config(config);

	function config($urlRouterProvider, $mdThemingProvider) {
		$urlRouterProvider
			.otherwise('/');

		$mdThemingProvider.theme('default')
      .primaryPalette('deep-orange')
      .accentPalette('deep-orange')
			.dark();
	}
})();
