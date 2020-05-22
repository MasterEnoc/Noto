const {readdirSync, statSync} = require('fs');
const {sep, basename} = require('path');

ipcRenderer.on('load-file', (event, data, path, birthtime, reminder)=>{
    let classes = ['file', 'fileActive'];
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

ipcRenderer.on('clear-reminder', ()=>{
//    retrieveReminder(null, null);
});

function createElement(innerText='', tag, className='', id=''){
    let element = document.createElement(tag);

    element.setAttribute('class', className);
    element.innerText = innerText;

    element.id = id;

    return element;
}

function changeWindowName(path){
    let windowName = document.querySelector('title');
    windowName.innerHTML = `Noto - ${basename(path)}`;
}
