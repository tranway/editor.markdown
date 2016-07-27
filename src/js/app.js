const electron = require('electron');
const {ipcRenderer} = electron;
const {remote} = electron;

 

angular.module('app', []) 
    .value('ipcRenderer', ipcRenderer);

;

function boot() {

    console.log("start bootstrap angular.");

    //init codemirror
    var editarea = document.getElementById("editarea");
    var codemirror = CodeMirror.fromTextArea(editarea, {
        lineNumbers: true
    });
   
   
    angular.module('app').value('codemirror', codemirror);
    angular.bootstrap(document, ['app']);
    console.log("finish bootstrap angular.");
}

document.addEventListener('DOMContentLoaded', boot);

ipcRenderer.on('update-message', function(event, method) {
    alert(method);
});
