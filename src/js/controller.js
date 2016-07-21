
const {dialog} = remote;

var chokidar = require('chokidar');

const path = require('path');
(function() {
    const fs = require('fs');

    angular
        .module('app')
        .controller('AppController', ["$scope", "logger",
            "ipcRenderer", "codemirror", AppController
        ]);
    var fileList = localStorage.fileList;
    var docs={};



    function AppController($scope, logger, ipcRenderer, codemirror) {
        var vm = this;
        vm.searchKey = searchKey;
        vm.closeWindow = closeWindow;
        vm.minWindow = minWindow;
        vm.maxWindow = maxWindow;

        vm.removeFile = removeFile;
        vm.addFile = addFile;
        vm.openFile = openFile;
        vm.isPreview = false;
        vm.currentFile = localStorage.currentFile;
        vm.preview = preview;
        vm.saveFile = saveFile;
        vm.updateView = updateView;
        codemirror.setOption("extraKeys", {
            'Ctrl-S': function(cm) {
                vm.saveFile(vm.currentFile);
                console.log("codemirror is press save ")
            }
        });

   
        var watcher = chokidar.watch('', {}).on('all', (event, path) => {
            console.log(event, path);
        });

        if (fileList) {
            console.log("file is not null");
            vm.fileList = JSON.parse(fileList);
            let keys =Object.keys(vm.fileList);
            keys.every(key => {
                let hist = localStorage['temp_hist_' + key];
                let cnt = localStorage['temp_' + key];
                if(cnt){
                     docs[key]={};
                     docs[key].doc =CodeMirror.Doc(cnt, 'markdown', 1); 
                     if(hist)docs[key].doc.setHistory(JSON.parse(hist)); 
                     codemirror.swapDoc(docs[key].doc); 
                }               

            });
            watcher.add(Object.keys(vm.fileList));
        } else {
            console.log("file is  null");
            vm.fileList = {};
        }
        if(vm.currentFile){
            openFile(vm.currentFile);
        }

        function preview(preview) {
            // body...
            vm.isPreview = !vm.isPreview;

        }

        function openFile(key) {
            // 打开文件 

            let fobj = vm.fileList[key];
            let cnt = null;
            cnt = localStorage['temp_' + key]; 
            if (!docs[key]) {
                cnt = fs.readFileSync(key, 'utf-8');
                localStorage['temp_' + key] = cnt;
                docs[key].doc= CodeMirror.Doc(cnt, 'markdown', 1);
            } else {

            }
            codemirror.swapDoc(docs[key].doc); 
            vm.currentFile =localStorage.currentFile= key;  
            
        }

        function saveFile(key) {
            let file = vm.fileList[key];
            console.log('save file:', key);
            
            let cnt = localStorage['temp_' + key];
            docs[key].doc.clearHistory();
            fs.writeFile(key, cnt, (err) => {
                if (err) throw err;
                file.isChanged = false;
                $scope.$apply();
            }); 
        }




        function removeFile(key) {
            //从列表中移除文件。
            delete vm.fileList[key];
            localStorage.fileList = JSON.stringify(vm.fileList);
            console.log("localStorage:", localStorage.fileList);
        }

        function addFile() {
            // 添加文件
            var files = dialog.showOpenDialog({
                properties: ['openFile', 'createDirectory', 'multiSelections']
            });
            console.log('openFIle is ', files);

            Array.isArray(files) && files.map(fp => {
                let fname = path.basename(fp);
                vm.fileList[fp] = {
                    name: fname,
                    path: fp,
                    isChanged: false
                };


            })
            localStorage.fileList = JSON.stringify(vm.fileList);
            watcher.add(files);
        }


        function maxWindow() {
            // 最大化窗口
            console.log("max window !!");
            ipcRenderer.send("window-all-maxed");
        }

        function minWindow() {
            /*最小化窗口*/
            console.log("min window is click!!");
            ipcRenderer.send("window-all-minimized")
        }

        function closeWindow() {
            /*关闭窗口*/
            console.log("closeWindow button is click!!");

            ipcRenderer.send("window-all-closed");
        }

        function searchKey(key) {
            console.log("search_fn is click and key is ", key);
        }
        function updateView () {
            
        }
        codemirror.on("changes", function(Editor, changes) {
            console.log("doc is changed ", vm.currentFile);
            let ht = codemirror.getHistory();
            //判断是否已经还原到最初状态
            localStorage['temp_' + vm.currentFile] = codemirror.getValue();
            localStorage['temp_hist_' + vm.currentFile] = JSON.stringify(codemirror.getHistory());

            var isOri = ht.done.filter(it => {
                return it.changes
            }).length == 0;
            if (!isOri) {
                //已经变更
                vm.fileList[vm.currentFile].isChanged = true;

            } else {
                vm.fileList[vm.currentFile].isChanged = false;
            }

            $scope.$apply();
        });
        codemirror.on("keyHandled", function(Editor,keyname, event) {
            console.log("keydonw ", keyname);
            
        });



    }

})();

 