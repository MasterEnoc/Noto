const {readFileSync} = require('fs');
const {ipcRenderer, remote} = require('electron');
const {changeWindowName} = require('./scripts/generalFunctions.js');
// Animation Events
let imageMenu = document.querySelector('#browser-img');
imageMenu.addEventListener('click',()=>{shrinkBar();});

ipcRenderer.on('shrink-bar', ()=>{
    shrinkBar();
});

function shrinkBar(){
    let img = document.querySelector('#files-img');
    let fileBrowser =  document.querySelector('#file-browser');
    let title = document.querySelector('#browser-name');
    let righ_title = document.querySelector('#file-area');
    let editor = document.querySelector('#editor');

    if (img.className === 'activeImg'){
        fileBrowser.style.width = '15vw';
        righ_title.style.width = '85vw';
        editor.style.width = '85vw';
        title.removeAttribute('hidden');
        img.className = '';
    }else {
        fileBrowser.style.width = '5vw';
        righ_title.style.width = '95vw';
        editor.style.width = '95vw';
        title.setAttribute('hidden', '');
        img.className = 'activeImg';
    }
}

// Files handling event

let fileItems = document.querySelector('#fb-files');
fileItems.addEventListener('click', (event) => {
    if (event.target.className==='file' || event.target.className==='fileActive'){

        let files = Array.from(document.getElementsByClassName('fileActive'));
        files.map((element) => {
            if (element.className === 'fileActive'){
                element.className = 'file';
            }
        });

        if (event.target.className === 'file'){
            event.target.className = 'fileActive';
        }
    }
});

fileItems.addEventListener('click', (event)=>{
    if (event.target.id){
        if (event.target.id.match(/^\//)){

            let files = remote.getGlobal('files');

            let editor = document.querySelector('#editor');
            editor.innerText = files[basename(event.target.id)].data;

            let nameBox = document.querySelector('#file-name');
            nameBox.innerHTML = basename(event.target.id);

            let birthBox = document.querySelector('#date');
            birthBox.innerHTML = files[basename(event.target.id)].birthtime;

            let remainderBox = document.querySelector('#customTxt');
            remainderBox.innerHTML = files[basename(event.target.id)].reminder;

            changeWindowName(event.target.id);

            ipcRenderer.send('change-currentPath', event.target.id);
        }
    }
});

