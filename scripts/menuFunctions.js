const {dialog, ipcMain} = require('electron');
const {readFileSync, writeFile, writeFileSync, readdirSync, statSync} = require('fs');
const {basename, dirname, sep} = require('path');
const {retrieveBirthtime, retrieveReminder, createFileEntry, saveReminders, createFileEntryWithData, createEntriesFromPaths} = require('./generalFunctions');


// sends filepath to openFile.js
function openFile(){
    global.files = {};

    let path =  dialog.showOpenDialogSync(global.win,{
        filters: [
            {name: 'Documents', extensions: ['txt']},
            {name: 'All files', extensions: ['*']}
        ],
        properties: ['openFile']
    });

    if (path) {

        let file = path[0];

        createFileEntry(file);

        win.webContents.send('load-file', global.files[basename(file)].data , file, global.files[basename(file)].birthtime,global.files[basename(file)].reminder);
        global.currentPath=file;
        global.folderPath=dirname(file);
    }
}

function openFileWithPath(path){
    global.files = {};

    createFileEntry(path);

    win.webContents.send('load-file', global.files[basename(path)].data , path, global.files[basename(path)].birthtime,global.files[basename(path)].reminder);
    global.currentPath=path;
    global.folderPath=dirname(path);
}

function openFolder(){
    global.files = {};

    let folder = dialog.showOpenDialogSync(global.win,{
        filters:[
            {name:'Documents', extensions:['txt']},
            {name:'All files', extensions: ['*']}
        ],
        properties: ['openDirectory']
    });

    if (folder){
        global.folderPath = folder[0];

        let files = readdirSync(folder[0]);

        createEntriesFromPaths(files);

        win.webContents.send('load-folder', Object.keys(global.files), global.folderPath);
    }
}

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
        win.webContents.send('request-text');
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

function emptyJson(){
    writeFile('reminders.json', '', (err) => {});

    let files = Object.keys(global.files);

    files.map((file)=> {
        global.files[file].reminder = '';
    });

    win.webContents.send('clear-reminder');
    console.log(global.files);
}

function emptyThisReminder(){
    global.files[basename(global.currentPath)].reminder = '';

    try {
        let json = JSON.parse(readFileSync('./reminders.json'));
        delete json[basename(global.currentPath)];
        writeFileSync('reminders.json', JSON.stringify(json));
        win.webContents.send('clear-reminder');
    } catch (error) {

    }
}

function remindersToTxt(){
    try {
        let json = JSON.parse(readFileSync('./reminders.json'));

        let path = dialog.showSaveDialogSync(global.win, {
            defaultPath:'reminders.txt',
            properties: ['openFile']
        });

        if (!path){
            throw 'Dialog canceled';
        }

        let entries = Object.entries(json);
        for (let [entry, reminder] of entries){
            writeFileSync(path, `${entry}:${reminder}\n`, {flag:'a'});
        }
    } catch (error) {
        console.log(error);
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
