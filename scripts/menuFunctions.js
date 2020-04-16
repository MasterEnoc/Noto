const {dialog, ipcMain} = require('electron');
const {readFileSync, writeFile, writeFileSync} = require('fs');
const {basename, dirname, sep} = require('path');

// sends filepath to openFile.js
async function openFile(){
    let file =  await dialog.showOpenDialog({filters: [{name: 'documents', extensions: ['txt']},{name: 'All files', extensions: ['*']}],properties: ['openFile']})

    if (!file.canceled){
        try {
            let data = readFileSync(file.filePaths[0]).toString();
            win.webContents.send('load-file', data, file.filePaths[0]);
            global.currentPath=file.filePaths[0];
            global.folderPath=dirname(file.filePaths[0]);
        } catch (error) {
            console.log(error);
        }
    }
}

// sends filepaths to openFile.js
async function openFolder(){
    let folder = await dialog.showOpenDialog({properties: ['openDirectory']});
    if (!folder.canceled){
        let path = folder.filePaths[0];
        win.webContents.send('load-folder', path);
        global.folderPath = path;
    }
}

// waits the text data from saveFile.js
async function saveAsFile(){
    let file = await dialog.showSaveDialog();
    if (!file.canceled){
        if (String(basename(file.filePath)).match(/[^\w._-]/)){
            win.webContents.send('filename-error');
        } else {
            win.webContents.send('request-text');
            ipcMain.once('got-text', (event, value, reminderData)=> {
                global.reminders[basename(file.filePath)] = reminderData;
                writeFile(file.filePath, value, (err)=>{});
                writeFile('reminders.json',JSON.stringify(global.reminders), (err)=>{});
                win.webContents.send('load-file', value,file.filePath);
            })
            global.currentPath=file.filePath;
            global.folderPath=dirname(file.filePath);
        }
    }
}

function saveFile(){
    if (global.currentPath){
        win.webContents.send('request-text');
        ipcMain.once('got-text', (event, value, reminderData, fileName)=>{
            global.reminders[basename(global.currentPath)] = reminderData;
            if (basename(global.currentPath)==fileName){
                writeFile(global.currentPath, value, (err)=> {});  
            } else {
                if (fileName.match(/[^\w.-]/)){
                    win.webContents.send('filename-error');
                } else {
                    writeFile(global.folderPath+sep+fileName, value, (err)=> {});  
                    win.webContents.send('load-folder', global.folderPath);
                }
            }
            writeFile('reminders.json',JSON.stringify(global.reminders), (err)=>{});
        })

    } else {
        saveAsFile();
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

async function remindersToTxt(){
    try {
        let json = JSON.parse(readFileSync('./reminders.json'));
        let path = await dialog.showOpenDialog({properties: ['openDirectory']})
        if (path.canceled){
            throw 'Dialog canceled';
        }
        let entries = Object.entries(json);
        for (let [entrie, reminder] of entries){
            writeFile(path.filePaths[0]+sep+'reminder.txt', `${entrie}:${reminder}\n`, {flag:'a'}, (err)=>{})
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    'openFile':openFile,
    'openFolder':openFolder,
    'saveAsFile':saveAsFile,
    'saveFile':saveFile,
    'emptyJson':emptyJson,
    'emptyThisReminder':emptyThisReminder,
    'remindersToTxt':remindersToTxt
}