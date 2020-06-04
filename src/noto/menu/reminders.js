const {dialog} = require('electron');
const {readFileSync, writeFileSync, writeFile} = require('fs');
const {basename} = require('path');

function emptyJson(){
    writeFile('reminders.json', '', (err) => {});

    let files = Object.keys(global.files);

    files.map((file)=> {
        global.files[file].reminder = '';
    });

    win.webContents.send('clear-reminder');
    console.log(global.files);
}

function emptyThisReminder(){
    global.files[basename(global.currentPath)].reminder = '';

    try {
        let json = JSON.parse(readFileSync('./reminders.json'));
        delete json[basename(global.currentPath)];
        writeFileSync('reminders.json', JSON.stringify(json));
        win.webContents.send('clear-reminder');
    } catch (error) {

    }
}

function remindersToTxt(){
    try {
        let json = JSON.parse(readFileSync('./reminders.json'));

        let path = dialog.showSaveDialogSync(global.win, {
            defaultPath:'reminders.txt',
            properties: ['openFile']
        });

        if (!path){
            throw 'Dialog canceled';
        }

        let entries = Object.entries(json);
        for (let [entry, reminder] of entries){
            writeFileSync(path, `${entry}:${reminder}\n`, {flag:'a'});
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    'emptyJson':emptyJson,
    'emptyThisReminder':emptyThisReminder,
    'remindersToTxt':remindersToTxt,
};
