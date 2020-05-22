const {statSync, readFileSync} = require('fs');
const {basename} = require('path');

function createFileEntry(path){
    let data = readFileSync(path);
    global.files[basename(path)] = {};
    global.files[basename(path)].data = data;
    global.files[basename(path)].birthtime = retrieveBirthtime(path);
    global.files[basename(path)].reminder = retrieveReminder(path);
}


function retrieveBirthtime(path){
    let date =  statSync(path);
    let stringDate = String(date.birthtime);
    let bdate = stringDate.slice(0,24);
    return bdate;
}

function retrieveReminder(path, option=1){
    let jsonReminder = JSON.parse(readFileSync('reminders.json'));
    if (jsonReminder.hasOwnProperty(basename(path))){
        return jsonReminder[basename(path)];
    } else {
        return '';
    }

}

module.exports = {
    'retrieveBirthtime':retrieveBirthtime,
    'retrieveReminder':retrieveReminder,
    'createFileEntry':createFileEntry
};
