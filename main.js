const { BrowserWindow, app, Menu} = require('electron');
const {openFile, openFolder, saveAsFile, saveFile} = require('./scripts/menuFunctions')

global.win;
global.currentPath = '';


const menu = [
    {
        label: '&File', submenu: [
            {label: 'Open Folder', click: openFolder},
            {label: 'Open File', click: openFile},
            {label: 'Save As', click: saveAsFile},
            {label: 'Save', click: currentPath ? saveFile:saveAsFile}
        ]
    },
    { label: '&Edit' },
    {
        label: '&Settings', submenu: [
            { label: 'quit', role: 'quit' }, { label: 'reload Noto', role: 'reload' }, { label: 'Dev Tools', role: 'toggleDevTools' }
        ]
    },
    { label: 'Automation' }
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