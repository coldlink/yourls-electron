const menubar = require('menubar');

let mb = menubar();

mb.on('ready', function ready () {
  console.log('app is ready');
  // your app code here
});

mb.on('after-create-window', function () {
  mb.window.openDevTools()
});
