const {dialog, ipcMain} = require('electron');
const {readFileSync, writeFile, writeFileSync} = require('fs');
const {basename} = require('path');

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

// sends filepaths to openFile.js
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
        ipcMain.once('got-text', (event, value, reminderData)=> {
            global.reminders[basename(file.filePath)] = reminderData;
            writeFile(file.filePath, value, (err)=>{});
            writeFile('reminders.json',JSON.stringify(global.reminders), (err)=>{});
        })
        global.currentPath=file.filePath;
    }
}

function saveFile(){
    if (global.currentPath){
        win.webContents.send('request-text');
        ipcMain.once('got-text', (event, value, reminderData)=>{
            global.reminders[basename(global.currentPath)] = reminderData;
            writeFile(global.currentPath, value, (err)=> {});  
            writeFile('reminders.json',JSON.stringify(global.reminders), (err)=>{});
        })
    }
}
//

function emptyJson(){
    writeFile('reminders.json', '', (err) => {})
    global.reminders = {};
}

function emptyThisReminder(){
    try {
        let json = JSON.parse(readFileSync('./reminders.json'));
        delete json[basename(global.currentPath)];
        writeFileSync('reminders.json', JSON.stringify(json));
        global.reminders = json;
    } catch (error) {
           
    }
}

module.exports = {
    'openFile':openFile,
    'openFolder':openFolder,
    'saveAsFile':saveAsFile,
    'saveFile':saveFile,
    'emptyJson':emptyJson,
    'emptyThisReminder':emptyThisReminder
}