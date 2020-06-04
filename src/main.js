const { BrowserWindow, app, Menu, ipcMain} = require('electron');
const {stat, writeFile, readFileSync} = require('fs');
const {menu} = require('./menu.js');
const {basename} = require('path');

global.win;
global.currentPath = '';
global.folderPath= '';
global.files={};

stat('./reminders.json',(err)=> {
    if (err){
        writeFile('./reminders.json','', ()=>'');
    }
});

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

    global.win.loadFile('./src/main.html');

    global.win.on('ready-to-show', () => {
        global.win.show();
    });
});

ipcMain.on('change-currentPath', (event, path) => {
    global.currentPath = path;
});

