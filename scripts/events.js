const {readFileSync} = require('fs');
const {ipcRenderer} = require('electron');
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
/*
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
// Loads every path
fileItems.addEventListener('click', (event)=>{
    if (event.target.id){
        if (event.target.id.match(/^\//)){

            let editor = document.querySelector('#editor');
            editor.innerText = readFileSync(event.target.id);
            ipcRenderer.send('change-currentPath', event.target.id);

            retrieveBirthtime(event.target.id);

            retrieveName(event.target.id);

            retrieveReminder(event.target.id);

            changeWindowName(event.target.id);

        }
    }
});
*/
