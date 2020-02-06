ipcRenderer.on('request-text', (event)=> {
    let text = document.querySelector('#editor');
    let data = text.value;
    event.sender.send('got-text', data);
})

