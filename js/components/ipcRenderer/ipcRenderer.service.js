(function() {
	'use strict';

	angular.module('YourlsApp')
		.factory('$ipc', ipcRendererService);

	function ipcRendererService() {
		const ipcRenderer = require('electron').ipcRenderer;

		let service = {
			on: on,
			once: once,
			removeListener: removeListener,
			removeAllListener: removeAllListener,
			send: send,
			sendSync: sendSync,
			sendToHost: sendToHost
		};

		return service

		//////////////

		function on(channel, listener) {
			ipcRenderer.on(channel, listener);
		}

		function once(channel, listener) {
			ipcRenderer.once(channel, listener);
		}

		function removeListener(channel, listener) {
			ipcRenderer.removeListener(channel, listener);
		}

		function removeAllListener(channel) {
			ipcRenderer.removeAllListener(channel);
		}

		function send(channel, arg) {
			ipcRenderer.send(channel, arg);
		}

		function sendSync(channel, arg) {
			ipcRenderer.sendSync(channel, arg);
		}

		function sendToHost(channel, arg) {
			ipcRenderer.sendToHost(channel, arg);
		}
	}
})();
