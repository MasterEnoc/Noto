const {ipcRenderer} = require('electron');
const {readdirSync, statSync} = require('fs');
const {sep, basename} = require('path');
const {changeWindowName} = require('./noto/utilities');

ipcRenderer.on('load-file', (event, data, path, birthtime, reminder)=>{
    const classes = ['file', 'fileActive'];
    for (element of classes){
	    let oldFiles = Array.from(document.getElementsByClassName(element));

	    oldFiles.map((fileElement)=>{
            fileElement.remove();
	    });
    }

    let textArea = document.querySelector('#editor');
    textArea.innerText = data;

    let fileBrowser = document.querySelector('#fb-files');
    let child = createElement(basename(path), 'div', 'fileActive', path);
    child.appendChild(createElement(path, 'span', 'popup'));
    fileBrowser.appendChild(child);

    let nameBox = document.querySelector('#file-name');
    nameBox.innerHTML = basename(path);

    let birthBox = document.querySelector('#date');
    birthBox.innerHTML = birthtime;

    let remainderBox = document.querySelector('#customTxt');
    remainderBox.innerHTML = reminder;

    changeWindowName(path);

});

ipcRenderer.on('load-folder', (event, files, folder )=>{
    const classes = ['file', 'fileActive'];
    for (element of classes){
	    let oldFiles = Array.from(document.getElementsByClassName(element));

	    oldFiles.map((file)=>{
            file.remove();
	    });
    }

    let fileBrowser = document.querySelector('#fb-files');
    files.map((file) => {
        let element = createElement(file, 'div', 'file', folder+sep+file);
        element.appendChild(createElement(file, 'span', 'popup'));
        fileBrowser.appendChild(element);
    });
});

ipcRenderer.on('clear-reminder', ()=>{
    let reminderBox = document.querySelector('#customTxt');

    reminderBox.innerHTML = '';
});

function createElement(innerText='', tag, className='', id=''){
    let element = document.createElement(tag);

    element.setAttribute('class', className);
    element.innerText = innerText;

    element.id = id;

    return element;
}


