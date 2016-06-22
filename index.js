const menubar = require('menubar');
const {Menu} = require('electron');

let mb = menubar({
  'show-on-right-click': true
});

mb.on('ready', function ready () {
  console.log('app is ready');
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Item 1', type: 'radio'}
  ]);
  console.log(mb.tray);
  mb.tray.setContextMenu(contextMenu);
});

mb.on('after-create-window', function () {
  mb.window.openDevTools();
});
