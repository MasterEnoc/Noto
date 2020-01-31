const {ipcRenderer} = require('electron');

ipcRenderer.on('load-file', (event, data, file)=>{
    let textArea = document.querySelector('#editor');
    textArea.innerHTML = data; 

    let namePattern = new RegExp(/[\w\d]+.(txt|docx)/i);
    let name = namePattern.exec(file);

    createFileElement(name[0]);

    let nameBox = document.querySelector('#file-name');
    nameBox.innerHTML = name[0];
})

function createFileElement(name){
    let fileBrowser = document.querySelector('#fb-files');


    let element = document.createElement('div');
    element.setAttribute('class', 'file active');
    element.innerText = name;

    fileBrowser.appendChild(element);
}