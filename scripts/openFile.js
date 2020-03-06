const {ipcRenderer} = require('electron');
const {readdirSync} = require('fs');
const {sep} = require('path');
const {retrieveBirthtime, createElement, retrieveName, retrieveReminder} = require('./scripts/generalFunctions');

ipcRenderer.on('load-file', (event, data, file)=>{
    let textArea = document.querySelector('#editor');
    textArea.value = data; 

    let name = retrieveName(file);

    let fileBrowser = document.querySelector('#fb-files');
    fileBrowser.appendChild(createElement(name, 'div', 'file active'));

    retrieveBirthtime(file);

    retrieveReminder(file);
    
})

ipcRenderer.on('load-folder', (event, folder)=>{
    let fileBrowser = document.querySelector('#fb-files');
    let files = readdirSync(folder.filePaths[0]);
    files.map((file) => {
        let element = createElement(file, 'div', 'file active', folder.filePaths[0]+sep+file);
        fileBrowser.appendChild(element);
    })
})