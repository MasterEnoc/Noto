const {readFileSync} = require('fs');

// Animation Events
let imageMenu = document.querySelector('#browser-img');
imageMenu.addEventListener('click', () => {
    var img = document.querySelector('#files-img');
    let fileBrowser =  document.querySelector('#file-browser');
    let title = document.querySelector('#browser-name');
    
    if (img.className === 'activeImg'){
        fileBrowser.style.width = '15%';
        title.removeAttribute('hidden');
        img.className = '';
    }else {
        fileBrowser.style.width = '50.08px';
        title.setAttribute('hidden', '');
        img.className = 'activeImg';
    }    
});

// Files handling event
let fileItems = document.querySelector('#fb-files');
fileItems.addEventListener('click', (event) => {
    let files = Array.from(document.getElementsByClassName('file'));
    files.map((element) => {
        if (element.className === 'file active'){
            element.className = 'file';
        }
    })

    if (event.target.className === 'file'){
        event.target.className = 'file active';
    }    
});

fileItems.addEventListener('click',(event)=>{
    if (event.target.id){
        let path = event.target.id;

        let data = readFileSync(path);
        let editor = document.querySelector('#editor');
        editor.value = data;
        ipcRenderer.send('change-currentPath', path);

        retrieveBirthtime(path);

        retrieveName(path);
    }
})