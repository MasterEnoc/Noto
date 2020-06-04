const {ipcMain} = require('electron');

function shrinkBar(){
    ipcMain.send('shrink-bar');
}

module.exports = {
    'shrinkBar':shrinkBar
};
