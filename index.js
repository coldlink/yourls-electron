const menubar = require('menubar');
const request = require('request');
const storage = require('electron-json-storage');
const {
	Menu,
	clipboard,
	globalShortcut,
	ipcMain
} = require('electron');

let settings = {};

let mb = menubar({
	'tooltip': 'YOURLS Electron',
	'icon': 'css/Icon.png',
	'height': 550
});

mb.on('ready', function ready() {
	//get saved settings and callback
	storage.get('settings', function(err, data) {
		if (err) throw err;
		settings = data;

		//build settings if they don't exist
		if (!settings.shortenClipboardShortcut) {
			settings.shortenClipboardShortcut = 'CmdOrCtrl+Alt+S';
			saveSettings(settings);
		}

		//build menu
		let contextMenu = [{
			label: 'Shorten from clipboard',
			accelerator: settings.shortenClipboardShortcut,
			click: shortenClipboard
		}, {
			label: 'Shorten from clipboard (No URL Validation)',
			click: shortenClipboardNoValidation
		}, {
			type: 'separator'
		}, {
			label: 'Open',
			click: function() {
				mb.showWindow();
			}
		}, {
			label: 'Settings',
			click: function() {
				mb.showWindow();
				mb.window.webContents.on('did-finish-load', () => {
					mb.window.webContents.send('redirect', 'settings');
				});
			}
		}, {
			type: 'separator'
		}, {
			label: 'Message: None',
			enabled: false
		}, {
			type: 'separator'
		}, {
			label: 'Quit YOURLS Electron',
			click: function () {
				mb.app.quit();
			}
		}];

		/*GLOBAL SHORTCUTS*/
		registerGlobalShortcuts();

		/*LISTENERS*/
		ipcMain.on('settings', (e, args) => {
			saveSettings(args);
		});

		ipcMain.on('shorten-url', (e, args) => {
			let req = settings.apiUrl + '/yourls-api.php?format=json&action=shorturl&signature=' + settings.token + '&url=' + args.url;

			if (args.keyword) {
				req += '&keyword=' + args.keyword;
			}

			request.get(req, function(err, response, body) {
				if (err) {
					return console.log(err);
				}
				console.log(JSON.parse(body));
				e.sender.send('yourls-response', JSON.parse(body));
			});
		});

		//remove default open window on click
		mb.tray.removeAllListeners();
		mb.tray.on('click', showContextMenu);
		mb.tray.on('right-click', showContextMenu);
		mb.tray.on('double-click', function () {
			mb.showWindow();
		});

		/*METHODS*/
		function registerGlobalShortcuts() {
			globalShortcut.register(settings.shortenClipboardShortcut, shortenClipboard);
		}

		function showContextMenu() {
			mb.tray.popUpContextMenu(Menu.buildFromTemplate(contextMenu));
		}

		function shortenClipboard(e, noValidate) {
			if (!validateUrl(clipboard.readText()) && !noValidate) {
				contextMenu[6].label = 'Message: Clipboard text does not look like a valid url!';
				return showContextMenu();
			}

			let req = settings.apiUrl + '/yourls-api.php?format=json&action=shorturl&signature=' + settings.token + '&url=' + clipboard.readText();

			request.get(req, function(err, response, body) {
				if (err) {
					return console.log(err);
				}
				let temp = JSON.parse(body);
				if (temp.shorturl) {
					clipboard.writeText(temp.shorturl);
				}
				contextMenu[6].label = 'Message: ' + temp.message;
			});
		}

		function shortenClipboardNoValidation(e) {
			shortenClipboard(e, true);
		}

		function saveSettings(arg) {
			settings = arg;
			storage.set('settings', settings, (err) => {
				if (err) throw err;
			});
		}

		function validateUrl(value) {
			return /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
		}
	});
});

mb.on('after-create-window', () => {
	// mb.window.openDevTools();
	mb.window.webContents.on('did-finish-load', () => {
		mb.window.webContents.send('settings', settings);
	});
});
