
const fs = require('fs');
const path = require('path');
const {app} = require('electron');
let configDir=path.join(app.getPath('userData'), 'config');
let configFile=path.join(configDir,'runtime.json');

function _checkFile () {

    try {
        fs.accessSync(configDir, fs.F_OK);
    } catch (e) {
        fs.mkdirSync(configDir);
    }

    try {
        fs.accessSync(configFile, fs.F_OK);
    } catch (e) {
        fs.writeFile(configFile, "{}");
    }
}

var storage = { 
        cpath:configFile,
        save: function(obj) {//保存配置 
            var cnt = JSON.stringify(obj);
            console.log("runtime!!!!:",cnt); 
            fs.writeFile( this.cpath, cnt);
        },
        restore: function() {//恢复配置
             _checkFile () ;
            cnt = fs.readFileSync(this.cpath, 'utf-8');
            
            return cnt && cnt !== 'undefined' ? (JSON.parse(cnt)) : {};          
        }

}

module.exports=storage;