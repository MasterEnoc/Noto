function closeFileBrowser(){
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
}

let imageMenu = document.querySelector('#browser-img');
imageMenu.addEventListener('click', () => {closeFileBrowser()});

function selectItem(event){
    let files = Array.from(document.getElementsByClassName('file'));
    files.map((element) => {
        if (element.className === 'file active'){
            element.className = 'file';
        }
    })

    if (event.target.className === 'file'){
        event.target.className = 'file active';
    }
};

let fileItems = document.querySelector('#fb-files');
fileItems.addEventListener('click', (event) => {selectItem(event)});

