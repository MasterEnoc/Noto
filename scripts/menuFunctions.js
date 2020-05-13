const {dialog, ipcMain} = require('electron');
const {readFileSync, writeFile, writeFileSync} = require('fs');
const {basename, dirname, sep} = require('path');

// sends filepath to openFile.js
function openFile(){
    let file =  dialog.showOpenDialogSync(global.win,{
        filters: [
            {name: 'Documents', extensions: ['txt']},
            {name: 'All files', extensions: ['*']}
        ],
        properties: ['openFile']
    });

    if (file){
        let data = readFileSync(file[0]).toString();
        win.webContents.send('load-file', data, file[0]);
        global.currentPath=file[0];
        global.folderPath=dirname(file[0]);
    }
} 

// sends filepaths to openFile.js
function openFolder(){
    let folder = dialog.showOpenDialogSync(global.win,{
        filters:[
            {name:'Documents', extensions:['txt']},
            {name:'All files', extensions: ['*']}
        ],
        properties: ['openDirectory']
    });

    if (folder){
        win.webContents.send('load-folder', folder[0]);
        global.folderPath = folder[0];
    }
}

// waits the text data from saveFile.js
function saveAsFile(){
    win.webContents.send('request-text');
    ipcMain.once('got-text', (event, value, reminderData, fileName)=> {
        let file = dialog.showSaveDialogSync(global.win, {defaultPath:fileName});
        if (file){
            if (String(basename(file)).match(/[^\w._-]/)){
                win.webContents.send('filename-error');
            } else {
                console.log(file);
                global.reminders[basename(file)] = reminderData;
                writeFile(file, value, (err)=>{console.log(err);});
                writeFile('reminders.json',JSON.stringify(global.reminders), (err)=>{});
                win.webContents.send('load-file', value,file);
                global.currentPath=file;
                global.folderPath=dirname(file);
            }
        }        
    });
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
        });

    } else {
        saveAsFile();
    }
}

//

function emptyJson(){
    writeFile('reminders.json', '', (err) => {});
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
        let path = await dialog.showOpenDialog({properties: ['openDirectory']});
        if (path.canceled){
            throw 'Dialog canceled';
        }
        let entries = Object.entries(json);
        for (let [entry, reminder] of entries){
            writeFile(path.filePaths[0]+sep+'reminder.txt', `${entry}:${reminder}\n`, {flag:'a'}, (err)=>{});
        }
    } catch (error) {
        console.error(error);
    }
}

function shrinkBar(){
    win.webContents.send('shrink-bar');
}

module.exports = {
    'openFile':openFile,
    'openFolder':openFolder,
    'saveAsFile':saveAsFile,
    'saveFile':saveFile,
    'emptyJson':emptyJson,
    'emptyThisReminder':emptyThisReminder,
    'remindersToTxt':remindersToTxt,
    'shrinkBar':shrinkBar
};
