(function () {
  'use strict';

  angular.module('YourlsApp')
    .config(config);

    function config($stateProvider) {
  		$stateProvider
  			.state('settings', {
  				url: '/settings',
  				templateUrl: 'js/settings/settings.html',
  				controller: 'SettingsCtrl as vm'
  			});
  	}
})();
