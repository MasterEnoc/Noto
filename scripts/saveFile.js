ipcRenderer.on('request-text', (event)=> {
    let text = document.querySelector('#editor');
    let data = text.innerText;

    let reminder = document.querySelector('#customTxt');
    let reminderData = reminder.innerText;

    let fileBox = document.querySelector('#file-name');
    let fileName = fileBox.innerText;

    let birthBox = document.querySelector('#date');
    let date= birthBox.innerHTML;

    event.sender.send('got-text', data, reminderData, fileName, date);
});

ipcRenderer.on('filename-error', ()=>{
    alert("The file's name can only contain the following characters: \n A-Z \n a-z \n 0-9 \n -");
});
