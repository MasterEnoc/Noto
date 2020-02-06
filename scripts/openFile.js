const {ipcRenderer} = require('electron');
const {statSync} = require('fs');

ipcRenderer.on('load-file', (event, data, file)=>{
    let textArea = document.querySelector('#editor');
    textArea.innerHTML = data; 

    let namePattern = new RegExp(/[\w\d]+.(txt|docx)/i);
    let name = namePattern.exec(file);
    let nameBox = document.querySelector('#file-name');
    nameBox.innerHTML = name[0];

    let fileBrowser = document.querySelector('#fb-files');
    fileBrowser.appendChild(createFileElement(name[0]));

    let date =  statSync(file);
    let stringDate = String(date.birthtime);
    let bdate = stringDate.slice(0,24)
    let dateBox = document.querySelector('#date');
    dateBox.innerHTML=bdate;
})

function createFileElement(innerText){
    let element = document.createElement('div');
    element.setAttribute('class', 'file active');
    element.innerText = innerText;
    return element;
}