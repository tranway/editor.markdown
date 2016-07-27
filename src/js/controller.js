
(function() {
    const _ = require('lodash');
    const {dialog} = remote;
    const marked = require('marked');
    const chokidar = require('chokidar');
    const path = require('path');
    const fs = require('fs');

    //初始化Marketdown渲染器,不影响原编辑文本。
    var renderer=new marked.Renderer();
    renderer.image=function(href,title,text){
        let temp='<img src="${href}" alt="$text{}" style="max-width:100%;">';
        var compiled = _.template(temp); 
        return  compiled({href:href,title:title,text:text });
    }
    renderer.heading = function(text, level) {
        var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

        return '<h' + level + '><a name="' +
            text +
            '" class="anchor" href="#' +
            escapedText +
            '"><span class="header-link"></span></a>' +
            text + '</h' + level + '>';
    }; 
    renderer.link = function(href, title,text) {
        var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

        return '<a href="javascript:void(0);" title="'+title+'">'+text+"</a>";
    }; 
    marked.setOptions({
              renderer:renderer ,
                 gfm: true,
                 tables: true, 
                 pedantic: false,
                 sanitize: true,
                 smartLists: true 
             });


   

    angular
        .module('app')
        .controller('AppController', ["$scope", 
            "ipcRenderer", "codemirror", AppController
        ]);
    var fileList = localStorage.fileList;
    var docs={};//打开文件内存缓存。

    function AppController($scope , ipcRenderer, codemirror) {
        var vm = this;
        vm.searchKey = searchKey;
        vm.closeWindow = closeWindow;
        vm.minWindow = minWindow;
        vm.maxWindow = maxWindow;
        vm.removeFile = removeFile;
        vm.addFile = addFile;
        vm.newFile = newFile;
        vm.openFile = openFile;
        vm.isPreview = false;
        vm.currentFile = localStorage.currentFile||"";
        vm.preview = preview;
        vm.saveFile = saveFile;
        //设置编辑器保存快捷键
        codemirror.setOption("extraKeys", {
            'Ctrl-S': function(cm) {
                vm.saveFile(vm.currentFile);               
            }
        });

        //初始化文件监听
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
                     docs[key].doc =CodeMirror.Doc(cnt, 'markdown', 0); 
                     if(hist)docs[key].doc.setHistory(JSON.parse(hist)); 
                     codemirror.swapDoc(docs[key].doc); 
                }               

            });
            watcher.add(Object.keys(vm.fileList));
        } else {
            console.log("file is  null");
            vm.fileList = {}; 
        }
        if(vm.fileList[vm.currentFile]){
            openFile(vm.currentFile);
        }else{
            localStorage['preview']='';
        }

        /**
         * 处理点击预览时事件。
         */
        function preview() {
            
            vm.isPreview = !vm.isPreview;
                        
            if(vm.isPreview){
                let cnt =localStorage['temp_' + vm.currentFile];
                localStorage['preview']=marked(cnt);
                ipcRenderer.send("show-preview");
            }else{
                localStorage['preview']="";
                ipcRenderer.send("hide-preview");
            }
        }
        /**
         * 创建新文件
         */
        function newFile () {
            console.log(_.now());
            let fname = '临时文件' + _.now();
            vm.fileList[fname] = {
                name: fname,
                path: fname,
                isChanged: false,
                isTemp:true
            };
            localStorage['temp_' + fname]="";
            localStorage.fileList = JSON.stringify(vm.fileList);

        }
        /**
         * 处理点击文件列表时打开文件事件。
         * @param  {string} key 文件标识ID
         * @return {[type]}     [description]
         */
        function openFile(key) {
            // 打开文件 
            let fobj = vm.fileList[key];
            let cnt = "";
            cnt = localStorage['temp_' + key]; 
            if (!docs[key]) {
                 if(!fobj.isTemp){
                    cnt = fs.readFileSync(key, 'utf-8') ;
                 };
                 localStorage['temp_' + key] = cnt;
                docs[key]={};
                docs[key].doc= CodeMirror.Doc(cnt, 'markdown', 0);
            } else {

            }
            codemirror.swapDoc(docs[key].doc); 
            vm.currentFile =localStorage.currentFile= key;  
            localStorage['preview']=marked(cnt);
            
        }

        function saveFile(key) {
            let file = vm.fileList[key];
            let cnt = localStorage['temp_' + key];
            console.log('save file:', key);
            if (file.isTemp) {
                let sfname = dialog.showSaveDialog({
                    title: '保存文件',
                    buttonLabel: '保存',
                    filters: [{
                        name: 'MarkDownFile(*.md)',
                        isTemp: false,
                        extensions: ['md']
                    }]
                });
                if(sfname){
                    fs.writeFile(sfname, cnt, (err) => {
                    if (err) throw err;
                    docs[key].doc.clearHistory(); 
                    file.isChanged = false;
                    file.isTemp=false;
                    file.path = sfname;
                    file.name= path.basename(sfname);
                    docs[sfname] = docs[key];
                    vm.fileList[sfname]=file;
                     localStorage['temp_' + sfname] = localStorage['temp_' + key];
                    if(vm.currentFile==key){vm.currentFile =localStorage.currentFile= sfname; };
                    localStorage.removeItem('temp_' + key);
                    watcher.add(sfname);
             
                    delete vm.fileList[key];
                    delete docs[key];
                    localStorage.fileList = JSON.stringify(vm.fileList);
                    $scope.$apply();
                }); 
                }
                

            } else {
 
                docs[key].doc.clearHistory();
                fs.writeFile(key, cnt, (err) => {
                    if (err) throw err;
                    file.isChanged = false;
                    $scope.$apply();
                }); 
            }
            
            
        }
        function removeFile(key) {
            //从列表中移除文件。
            delete vm.fileList[key];
            localStorage.fileList = JSON.stringify(vm.fileList);
            console.log("localStorage:", localStorage.fileList);
        }
        /**
         * 处理点击添加文件时的处理事件。
         */
        function addFile() {
            // 弹出打开文件dialog选择添加文件
            var files = dialog.showOpenDialog({
                properties: ['openFile', 'createDirectory', 'multiSelections'],
                filters: [{
                    name: 'MarkDown',
                    isTemp:false,
                    extensions: ['md']
                } ]
            });

            console.log('openFIle is ', files);
            // 可以进行多选文件。
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
        function edit_closeFile (arguments) {
            // body...
        }


        function maxWindow() {
            // 最大化窗口
            console.log("max window !!");
            ipcRenderer.send("w-maxed");
        }

        function minWindow() {
            /*最小化窗口*/
             
            console.log("min window is click!!");
            ipcRenderer.send("w-minimized");
        }

        function closeWindow() {
            /*关闭窗口*/
            console.log("closeWindow button is click!!");
            watcher.close();
            ipcRenderer.send("close-window");
        }
        /**
         * 当点击搜索时处理事件
         * @param  {string} key 搜索的关键字
         */
        function searchKey(key) {
            console.log("search_fn is click and key is ", key);
        }
        /**
         * 当编辑器光标移动时处理事件
         */
        codemirror.on('cursorActivity',function  (E) {
            // body...
            var cur = E.getCursor();
            let select = codemirror.getLine(cur.line);
            if(_.startsWith(select, '#')){
                localStorage.select_txt=select.replace(/^#+\s/,'')
            } 
        });
        /**
         * 处理当编辑器内容变更时的事件。
         */
        codemirror.on("changes", function(Editor, changes) {
            
            let ht = codemirror.getHistory();
            //判断是否已经还原到最初状态
            let cnt = codemirror.getValue();
            localStorage['temp_' + vm.currentFile] = cnt;
            localStorage['temp_hist_' + vm.currentFile] = JSON.stringify(codemirror.getHistory());

            var isOri = ht.done.filter(it => {return it.changes}).length == 0;
            if (!isOri) {
                //已经变更
                vm.fileList[vm.currentFile].isChanged = true;

            } else {
                vm.fileList[vm.currentFile].isChanged = false;
            }
            if(vm.isPreview){
                localStorage['preview']=marked(cnt);
            }

            $scope.$apply();
        });
        
 
    }

})();

 