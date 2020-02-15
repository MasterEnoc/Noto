const {dialog, ipcMain} = require('electron');
const {readFileSync, writeFileSync} = require('fs');

// sends filepath to openFile.js
async function openFile(){
    let file =  await dialog.showOpenDialog({filters: [{name: 'documents', extensions: ['docx', 'txt']}],properties: ['openFile']})

    if (!file.canceled){
        try {
            let data = readFileSync(file.filePaths[0]).toString();
            win.webContents.send('load-file', data, file.filePaths[0]);
            global.currentPath=file.filePaths[0];
        } catch (error) {
            console.log(error);
        }
    }
}

async function openFolder(){
    let folder = await dialog.showOpenDialog({properties: ['openDirectory']});

    if (!folder.canceled){
        win.webContents.send('load-folder', folder);
    }
}

// waits the text data from saveFile.js
async function saveAsFile(){
    let file = await dialog.showSaveDialog({filters: [{name: 'Documents', extensions: ['docx', 'txt']}]})
    if (!file.canceled){
        win.webContents.send('request-text');
        ipcMain.once('got-text', (event, value)=> {
            writeFileSync(file.filePath, value);
        })
        global.currentPath=file.filePath;
    }
}

function saveFile(){
    if (global.currentPath){
        win.webContents.send('request-text');
        ipcMain.once('got-text', (event, value)=>{
            writeFileSync(global.currentPath, value);
        })
    }
}

module.exports = {
    'openFile':openFile,
    'openFolder':openFolder,
    'saveAsFile':saveAsFile,
    'saveFile':saveFile
}