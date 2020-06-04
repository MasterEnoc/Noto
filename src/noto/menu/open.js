const {dialog} = require('electron');
const {readdirSync} = require('fs');
const {basename, dirname} = require('path');
const {createFileEntry, createEntriesFromPaths} = require('../utilities.js');

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

module.exports = {
    'openFile':openFile,
    'openFolder':openFolder
};
