const {ipcRenderer} = require('electron');
const {readdirSync, statSync} = require('fs');
const {sep} = require('path');
const {retrieveBirthtime, createElement, retrieveName, retrieveReminder, changeWindowName} = require('./scripts/generalFunctions');

ipcRenderer.on('load-file', (event, data, file)=>{

    let classes = ['file', 'fileActive'];
    for (element of classes){
	let oldFiles = Array.from(document.getElementsByClassName(element));

	oldFiles.map((file)=>{
            file.remove();
	});
    }
    
    let textArea = document.querySelector('#editor');
    textArea.innerText = data; 

    let name = retrieveName(file);

    let fileBrowser = document.querySelector('#fb-files');
    let child = createElement(name, 'div', 'fileActive', file);
    child.appendChild(createElement(name, 'span', 'popup'));
    fileBrowser.appendChild(child);

    retrieveBirthtime(file);

    retrieveReminder(file);

    changeWindowName(file);
});

ipcRenderer.on('load-folder', (event, folder)=>{

    let classes = ['file', 'fileActive'];
    
    for (element of classes){
        
	    let oldFiles = Array.from(document.getElementsByClassName(element));

	    oldFiles.map((file)=>{
            file.remove();
	    });
    }
    
    let fileBrowser = document.querySelector('#fb-files');
    let files = readdirSync(folder);
    files.map((file) => {
        let fileStat = statSync(folder+sep+file);
        if (!fileStat.isDirectory()){
            let element = createElement(file, 'div', 'file', folder+sep+file);
            element.appendChild(createElement(file, 'span', 'popup'));
            fileBrowser.appendChild(element);
        }
    });
});
