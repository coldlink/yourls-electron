const menubar = require('menubar');
const request = require('request');
const storage = require('electron-json-storage');
const {
	Menu,
	clipboard,
	globalShortcut,
	ipcMain
} = require('electron');

let settings;

let mb = menubar({
	'show-on-right-click': true,
	'tooltip': 'YOURLS Electron'
});

mb.on('ready', function ready() {
	//get saved settings
	storage.get('settings', function(err, data) {
		if (err) throw err;
		settings = data;
	});

	//build menu
	let contextMenu = [{
		label: 'Shorten from clipboard',
		accelerator: 'CmdOrCtrl+Alt+S',
		click: shorten
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
	}];
	updateMenuBar();

	/*GLOBAL SHORTCUTS*/
	const ret = globalShortcut.register('CmdOrCtrl+Alt+S', shorten);

	/*MESSAGE LISTENERS*/
	ipcMain.on('settings', function(e, args) {
		saveSettings(args);
	});

	/*METHODS*/
	function updateMenuBar() {
		mb.tray.setContextMenu(Menu.buildFromTemplate(contextMenu));
	}

	function shorten(e, longUrl) {
		let req = settings.apiUrl + '/yourls-api.php?format=json&action=shorturl&signature=' + settings.token + '&url=';

		if (longUrl) {
			req += longUrl;
		} else {
			req += clipboard.readText();
		}

		console.log(req);
		// request.get(req, function(err, response, body) {
		// 	if (err) {
		// 		return console.log(err);
		// 	}
		// 	console.log(JSON.parse(body));
		// });
	}

	function saveSettings(arg) {
		settings = arg;
		storage.set('settings', settings, (err) => {
			if (err) throw err;
		});
	}
});

mb.on('after-create-window', function() {
	mb.window.openDevTools();
	mb.window.webContents.on('did-finish-load', () => {
		mb.window.webContents.send('settings', settings);
	});
});
