const { BrowserWindow, app, Menu, ipcMain} = require('electron');
const {openFile, openFolder, saveAsFile, emptyJson, saveFile, emptyThisReminder, remindersToTxt} = require('./scripts/menuFunctions');
const {stat, writeFile, readFileSync} = require('fs');

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

const menu = [
    {
        label: '&File', submenu: [
            {label: '&Open File', click: openFile, accelerator:'Ctrl+o'},
            {label: 'O&pen Folder', click: openFolder, accelerator:'Ctrl+Shift+o'},
            {label: '&Save As', click: saveAsFile, accelerator: 'Ctrl+Shift+s'},
            {label: 'S&ave', click: saveFile, accelerator:'Ctrl+s'}
        ]
    },
    { label: '&Edit', submenu:[
        {label:'Undo', role:'undo'},
        {label:'Redo', role:'redo'},
        {label:'Copy', role:'copy'},
        {label:'Paste', role:'paste'},
        {label:'Cut', role:'cut'},
        {label:'Move left', accelerator:'Ctrl+h'},
        {label:'Move down', accelerator:'Ctrl+j'},
        {label:'Move up', accelerator:'Ctrl+k'},
        {label:'Move right', accelerator:'Ctrl+l'}
    ]},
    {
        label: '&Settings', submenu: [
            { label: 'Quit', role: 'quit' },
            { label: 'Reload Noto', role: 'reload' },
            { label: 'Dev Tools', role: 'toggleDevTools' }
        ]
    },
    { label: '&Reminders', submenu: [
        {label: 'Empty reminders', click:emptyJson},
        {label:'Empty this reminder', click:emptyThisReminder},
        {label:'Reminders to txt', click:remindersToTxt}
        ]
    }
];

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
