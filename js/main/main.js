(function() {
	'use strict';
	angular.module('YourlsApp')
		.config(config);

	function config($stateProvider) {
		$stateProvider
			.state('main', {
				url: '/',
				templateUrl: 'js/main/main.html',
				controller: 'MainCtrl as vm'
			});
	}
})();
