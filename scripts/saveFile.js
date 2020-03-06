ipcRenderer.on('request-text', (event)=> {
    let text = document.querySelector('#editor');
    let data = text.value;

    let reminder = document.querySelector('#customTxt');
    let reminderData = reminder.innerHTML;
    event.sender.send('got-text', data, reminderData);
})