const { BrowserWindow, app, Menu, ipcMain} = require('electron');
const {stat, writeFile, readFileSync} = require('fs');
const {menu} = require('./menu.js');

global.win;
global.currentPath = '';
global.reminders = {};
global.folderPath= '';

stat('./reminders.json',(err)=> {
    if (err){
        writeFile('./reminders.json','', ()=>'');
    }
});

try {
    global.reminders = JSON.parse(readFileSync('reminders.json'));
} catch (error) {

}

Menu.setApplicationMenu(Menu.buildFromTemplate(menu));

app.on('ready', () => {
    global.win = new BrowserWindow({
        width: 785, height: 780,
        show: false,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegration: true,
            webviewTag: true,
        }
    });

    global.win.loadFile('main.html');

    global.win.on('ready-to-show', () => {
        global.win.show();
    });

    global.win.on('closed', () => {
        global.win = null;
    });
});

ipcMain.on('change-currentPath', (event, path) => {
    global.currentPath = path;
});
