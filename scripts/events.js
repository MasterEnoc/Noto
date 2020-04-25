const {readFileSync} = require('fs');

// Animation Events
let imageMenu = document.querySelector('#browser-img');
imageMenu.addEventListener('click', () => {
    var img = document.querySelector('#files-img');
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
});

// Files handling event
let fileItems = document.querySelector('#fb-files');

fileItems.addEventListener('click', (event) => {
    let files = Array.from(document.getElementsByClassName('fileActive'));
    files.map((element) => {
        if (element.className === 'fileActive'){
            element.className = 'file';
        }
    })

    if (event.target.className === 'file'){
        event.target.className = 'fileActive';
    }    
});

fileItems.addEventListener('click',(event)=>{
    if (event.target.id){
        let path = event.target.id;

        let data = readFileSync(path);
        let editor = document.querySelector('#editor');
        editor.innerText = data;
        ipcRenderer.send('change-currentPath', path);

        retrieveBirthtime(path);

        retrieveName(path);

        retrieveReminder(path);

        changeWindowName(path);
    }
})