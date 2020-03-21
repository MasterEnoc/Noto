const { BrowserWindow, app, Menu, ipcMain} = require('electron');
const {openFile, openFolder, saveAsFile, emptyJson, saveFile, emptyThisReminder} = require('./scripts/menuFunctions');
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
            {label: 'Open Folder', click: openFolder},
            {label: 'Open File', click: openFile},
            {label: 'Save As', click: saveAsFile},
            {label: 'Save', click: saveFile}
        ]
    },
    { label: '&Edit' },
    {
        label: '&Settings', submenu: [
            { label: 'Quit', role: 'quit' }, { label: 'Reload Noto', role: 'reload' }, { label: 'Dev Tools', role: 'toggleDevTools' }
        ]
    },
    { label: '&Reminders', submenu: [
        {label: 'Empty reminders', click:emptyJson}, {label:'Empty this reminder', click:emptyThisReminder}
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
    })

    global.win.on('closed', () => {
        global.win = null;
    })
})

ipcMain.on('change-currentPath', (event, path) => {
    global.currentPath = path;
})