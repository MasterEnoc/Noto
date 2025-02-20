const {statSync, readFileSync, writeFile, writeFileSync} = require('fs');
const {basename, sep} = require('path');

function createFileEntry(path){
    global.files[basename(path)] = {};
    global.files[basename(path)].data = readFileSync(path);
    global.files[basename(path)].birthtime = retrieveBirthtime(path);
    global.files[basename(path)].reminder = retrieveReminder(path);
}

function createEntriesFromPaths(files){
    files.map((file) =>{
        let fileStat = statSync(global.folderPath+sep+file);
        if (!fileStat.isDirectory()){
            createFileEntry(global.folderPath+sep+file);
        }
    });
}

function createFileEntryWithData(fileName, data, reminder, birthTime){
    global.files[fileName] = {};
    global.files[fileName].data = data;
    global.files[fileName].birthtime = birthTime;
    global.files[fileName].reminder = reminder;
}

function retrieveBirthtime(path){
    let date =  statSync(path);
    let stringDate = String(date.birthtime);
    let bdate = stringDate.slice(0,24);
    return bdate;
}

function retrieveReminder(path){
    var jsonReminder;

    try {
    jsonReminder = JSON.parse(readFileSync('reminders.json'));
    } catch (err) {
        return '';
    }

    if (jsonReminder.hasOwnProperty(basename(path))){
        return jsonReminder[basename(path)];
    } else {
        return '';
    }

}

function saveReminders(fileName, reminder){
    var jsonReminder;
    try {
        jsonReminder = JSON.parse(readFileSync('reminders.json'));
    } catch (err) {
        jsonReminder = {};
    }

    jsonReminder[fileName] = reminder;

    writeFileSync('reminders.json',JSON.stringify(jsonReminder), (err)=>{console.log(err);});
}

function changeWindowName(path){
    let windowName = document.querySelector('title');
    windowName.innerHTML = `Noto - ${basename(path)}`;
}

module.exports = {
    'retrieveBirthtime':retrieveBirthtime,
    'retrieveReminder':retrieveReminder,
    'createFileEntry':createFileEntry,
    'saveReminders':saveReminders,
    'createEntriesFromPaths':createEntriesFromPaths,
    'createFileEntryWithData':createFileEntryWithData,
    'changeWindowName':changeWindowName
};
