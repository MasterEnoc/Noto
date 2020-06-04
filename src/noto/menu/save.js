const {dialog, ipcMain} = require('electron');
const {writeFile, writeFileSync, readdirSync} = require('fs');
const {basename, dirname, sep} = require('path');
const {saveReminders, createFileEntry, createFileEntryWithData, createEntriesFromPaths} = require('../utilities');

function saveAsFile(){
    win.webContents.send('request-text');
    ipcMain.once('got-text', (event, fileName, data, reminder,  date)=> {
        let file = dialog.showSaveDialogSync(global.win, {defaultPath:fileName});
        if (file){
            if (String(basename(file)).match(/[^\w._-]/)){
                win.webContents.send('filename-error');
            } else {
                writeFileSync(file, data);
                saveReminders(fileName, reminder);
                openFileWithPath(file);
            }
        }
    });
}

function saveFile(){
    if (global.currentPath){
        global.win.webContents.send('request-text');
        ipcMain.once('got-text', (event, fileName, data, reminder, date)=>{
            if (basename(global.currentPath)==fileName){
                writeFile(global.currentPath, data, ()=>{});
                createFileEntryWithData(fileName, data, reminder, date);
                saveReminders(fileName, reminder);
            } else {
                if (fileName.match(/[^\w.-]/)){
                    win.webContents.send('filename-error');
                } else {
                    global.files = {};
                    writeFileSync(global.folderPath+sep+fileName, data);
                    createEntriesFromPaths(readdirSync(dirname(global.currentPath)));
                    win.webContents.send('load-folder', Object.keys(global.files) , global.folderPath);
                    saveReminders(fileName, reminder);
                }
            }
        });
    } else {
        saveAsFile();
    }
}

function openFileWithPath(path){
    global.files = {};

    createFileEntry(path);

    win.webContents.send('load-file', global.files[basename(path)].data , path, global.files[basename(path)].birthtime,global.files[basename(path)].reminder);
    global.currentPath=path;
    global.folderPath=dirname(path);
}

module.exports = {
    'saveAsFile':saveAsFile,
    'saveFile':saveFile
};
