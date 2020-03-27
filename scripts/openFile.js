const {ipcRenderer} = require('electron');
const {readdirSync} = require('fs');
const {sep} = require('path');
const {retrieveBirthtime, createElement, retrieveName, retrieveReminder} = require('./scripts/generalFunctions');

ipcRenderer.on('load-file', (event, data, file)=>{
    let oldFiles = Array.from(document.getElementsByClassName('file'));
    
    oldFiles.map((file)=>{
        file.remove();
    })
    
    let textArea = document.querySelector('#editor');
    textArea.value = data; 

    let name = retrieveName(file);

    let fileBrowser = document.querySelector('#fb-files');
    fileBrowser.appendChild(createElement(name, 'div', 'file active', file));

    retrieveBirthtime(file);

    retrieveReminder(file);
    
})

ipcRenderer.on('load-folder', (event, folder)=>{

    let oldFiles = Array.from(document.getElementsByClassName('file'));

    oldFiles.map((file)=>{
        file.remove();
    })

    let fileBrowser = document.querySelector('#fb-files');
    let files = readdirSync(folder);
    files.map((file) => {
        let element = createElement(file, 'div', 'file', folder+sep+file);
        fileBrowser.appendChild(element);
    })
})