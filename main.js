const { BrowserWindow, app, Menu, dialog, ipcMain} = require('electron');
const {readFileSync, writeFileSync} = require('fs');

let win;


const menu = [
    {
        label: '&File', submenu: [
            { label: 'Open Folder', click: 'open'},
            {label: 'Open File', click: openFile},
            {label: 'Save As', click: saveAsFile},
            {label: 'Save'}
        ]
    },
    { label: '&Edit' },
    {
        label: '&Settings', submenu: [
            { label: 'quit', role: 'quit' }, { label: 'reload', role: 'reload' }, { label: 'Dev Tools', role: 'toggleDevTools' }
        ]
    },
    { label: 'Automation' }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(menu));

app.on('ready', () => {
    win = new BrowserWindow({
        width: 785, height: 780,
        show: false,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegration: true,
            webviewTag: true
        }
    });

    win.loadFile('main.html');

    win.on('ready-to-show', () => {
        win.show();
    })

    win.on('closed', () => {
        win = null;
    })
})

// sends filepath to openFile.js
async function openFile(){
    let file =  await dialog.showOpenDialog({filters: [{name: 'documents', extensions: ['docx', 'txt']}]},{properties: ['openFile']})

    if (!file.canceled){
        try {
            let data = readFileSync(file.filePaths[0]).toString();
            win.webContents.send('load-file', data, file.filePaths[0]);
        } catch (error) {
            console.log(error);
        }
    }
}

// waits the text data from saveFile.js
async function saveAsFile(){
    let file = await dialog.showSaveDialog({filters: [{name: 'Documents', extensions: ['docx', 'txt']}]})
    win.webContents.send('request-text');
    ipcMain.once('got-text', (event, value)=> {
        writeFileSync(file.filePath, value);
    })
}