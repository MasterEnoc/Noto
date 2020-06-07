ipcRenderer.on('request-text', (event)=> {
    let textBox = document.querySelector('#editor');
    let data = textBox.innerText;

    let reminderBox = document.querySelector('#customTxt');
    let reminder = reminderBox.innerText;

    let fileBox = document.querySelector('#file-name');
    let fileName = fileBox.innerText;

    let birthBox = document.querySelector('#date');
    let date= birthBox.innerHTML;

    event.sender.send('got-text',fileName, data, reminder, date);
});

ipcRenderer.on('filename-error', ()=>{
    alert("The file's name can only contain the following characters: \n A-Z \n a-z \n 0-9 \n -");
});
