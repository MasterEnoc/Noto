const {emptyJson, emptyThisReminder, remindersToTxt} = require('./noto/menu/reminders');
const {openFolder, openFile} = require('./noto/menu/open');
const {saveFile, saveAsFile} = require('./noto/menu/save');
const {shrinkBar} = require('./noto/menu/triggers');

const menu = [
    {
        label: '&File', submenu: [
            {label: '&Open File', click:()=>{openFile();}, accelerator:'Ctrl+o'},
            {label: 'O&pen Folder', click: ()=>{openFolder();}, accelerator:'Ctrl+Shift+o'},
            {label: '&Save As', click: ()=>{saveAsFile();}, accelerator: 'Ctrl+Shift+s'},
            {label: 'S&ave', click: ()=>{saveFile();}, accelerator:'Ctrl+s'}
        ]
    },
    { label: '&Edit', submenu:[
        {label:'Undo', role:'undo'},
        {label:'Redo', role:'redo'},
        {label:'Copy', role:'copy'},
        {label:'Paste', role:'paste'},
        {label:'Cut', role:'cut'},
    ]},
    {
        label: '&Settings', submenu: [
            { label: 'Quit', role: 'quit' },
            { label: 'Reload Noto', role: 'reload' },
            { label: 'Dev Tools', role: 'toggleDevTools' },
            { label: 'Toggle file browser',click: ()=>{global.win.webContents.send('shrink-bar');},
              accelerator: 'Ctrl+b'}
        ]
    },
    { label: '&Reminders', submenu: [
        {label: 'Empty reminders', click:()=>{emptyJson();}},
        {label:'Empty this reminder', click:()=>{emptyThisReminder();}},
        {label:'Reminders to txt', click:()=>{remindersToTxt();}}
        ]
    }
];

module.exports = {
    'menu':menu
};
