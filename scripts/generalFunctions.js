const {statSync, readFileSync} = require('fs');
const {basename} = require('path');

function createElement(innerText='', tag, className='', id=''){
    let element = document.createElement(tag);

    element.setAttribute('class', className);
    element.innerText = innerText;

    element.id = id;

    return element;
}

function retrieveBirthtime(path){
    let date =  statSync(path);
    let stringDate = String(date.birthtime);
    let bdate = stringDate.slice(0,24);
    let dateBox = document.querySelector('#date');
    dateBox.innerHTML=bdate;
}

function retrieveName(path){
    let name = basename(path);
    let nameBox = document.querySelector('#file-name');
    nameBox.innerHTML = name;
    return name;
}

function retrieveReminder(path, option=1){
    let reminderData = document.querySelector('#customTxt');
    if (option===1){
        let jsonReminder = JSON.parse(readFileSync('reminders.json'));

        if (jsonReminder.hasOwnProperty(basename(path))){
            reminderData.innerHTML = jsonReminder[basename(path)];
        } else {
            reminderData.innerHTML = '';
        }
    } else {
        reminderData.innerHTML = '';
    }
}

function changeWindowName(path){
    let windowName = document.querySelector('title');
    windowName.innerHTML = `Noto - ${basename(path)}`;
}

module.exports = {
    'createElement': createElement,
    'retrieveBirthtime':retrieveBirthtime,
    'retrieveName':retrieveName,
    'retrieveReminder':retrieveReminder,
    'changeWindowName':changeWindowName
};
