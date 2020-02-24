const {statSync} = require('fs');
const {basename} = require('path')

function createElement(innerText='', tag, className='', id=''){
    let element = document.createElement(tag);

    element.setAttribute('class', className);
    element.innerText = innerText;

    element.id = id;

    return element;
}

function retrieveBirthtime(file){
    let date =  statSync(file);
    let stringDate = String(date.birthtime);
    let bdate = stringDate.slice(0,24)
    let dateBox = document.querySelector('#date');
    dateBox.innerHTML=bdate;
}

function retrieveName(path){
    // let namePattern = new RegExp(/[\w\d]+.(txt|docx)/i);
    let name = basename(path);
    let nameBox = document.querySelector('#file-name');
    nameBox.innerHTML = name;
    return name;
}

module.exports = {
    'createElement': createElement,
    'retrieveBirthtime':retrieveBirthtime,
    'retrieveName':retrieveName
};