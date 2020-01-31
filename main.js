const { BrowserWindow, app, Menu, dialog} = require('electron');
const {readFileSync} = require('fs');

let win;


let menu = [
    {
        label: '&File', submenu: [
            { label: 'Open Folder', click: 'open'},
            {label: 'Open File', click: openFile}
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

async function openFile(){
    let file =  await dialog.showOpenDialog({filters: [{name: 'documents', extensions: ['docx', 'txt']}]},{properties: ['openFile']})

    try {
        let data = readFileSync(file.filePaths[0]).toString();
        win.webContents.send('load-file', data, file.filePaths[0]);
    } catch (error) {
        console.log(error);
    }
}