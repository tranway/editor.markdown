
const {dialog} = remote;

var chokidar = require('chokidar');

const path = require('path');


(function() {
	const fs = require('fs');

    angular
        .module('app')
        .controller('AppController', ["$scope", "logger", 
        						"ipcRenderer","codemirror", AppController]);
    var fileList = localStorage.fileList;
    

    function AppController($scope, logger,ipcRenderer,codemirror) {
        var vm = this; 
        vm.searchKey = searchKey;
        vm.closeWindow = closeWindow;
        vm.minWindow = minWindow;
        vm.maxWindow = maxWindow;
         
        vm.removeFile=removeFile;
        vm.addFile=addFile; 
        vm.openFile=openFile;
        vm.currentFile ="";

        var watcher = chokidar.watch('', {}).on('all', (event, path) => {
            console.log(event, path);
        }); 

        if(fileList){
        	console.log("file is not null");
        	vm.fileList =JSON.parse(fileList);
        	watcher.add(Object.keys(vm.fileList) );
        }else{
        	console.log("file is  null");
        	vm.fileList ={};
        }

        function openFile(key) {
            // 打开文件


            let fobj = vm.fileList[key];
            let cnt = "";
            let history =localStorage['temp_'+key];
           
            if(!cnt){
            	 cnt = fs.readFileSync(key, 'utf-8');
                 //localStorage['temp_'+key] = cnt;
            }
            vm.currentFile = key;
            console.log("openfile:", key, history);
            codemirror.setValue(cnt);
            if(history){
            	codemirror.setHistory(JSON.parse(history));
            }  
        }


     
        function removeFile (key) {
        	//从列表中移除文件。
        	 delete vm.fileList[key];
        	 localStorage.fileList = JSON.stringify(vm.fileList);
        	 console.log("localStorage:",localStorage.fileList);
        	 
        }

        function addFile () {
        	// 添加文件
        	var files = dialog.showOpenDialog({properties: 
        	 	['openFile','openDirectory', 'createDirectory', 'multiSelections']  });
        	console.log('openFIle is ',files); 
        	Array.isArray(files)&&files.map(fp=>{
        		let fname =path.basename(fp); 
        		vm.fileList[fp]={name:fname,path:fp,changed:false};

        		 
        	}) 
        	localStorage.fileList = JSON.stringify(vm.fileList);
        	watcher.add(files);
        }


        function maxWindow () {
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
            console.log("closeWindow button is click!!" );
            
            ipcRenderer.send("window-all-closed");
        }

        function searchKey(key) {
            console.log("search_fn is click and key is ", key);
        } 
        codemirror.on("change", function(Editor, changes) {
            /*while (changes) {
                //Editor1.replaceRange(changes.text.join("\n"), changes.from, changes.to);
                console.log("edit is change!",changes);
                changes = changes.next;
            }*/
            localStorage['temp_'+vm.currentFile] 
            		= JSON.stringify(codemirror.getHistory());
        });
 

    }

})();



