
const fs = require('fs');
var storage = { 
        save: function(obj) {//保存配置 
            var cnt = JSON.stringify(obj);
            console.log("runtime!!!!:",cnt); 
            fs.writeFile(__dirname + '/config/runtime.json', cnt);
        },
        restore: function() {//恢复配置
            cnt = fs.readFileSync(__dirname + '/config/runtime.json', 'utf-8');
            
            return cnt&&cnt!=='undefined' ? (JSON.parse(cnt)) : {};
        	 
        }

}

module.exports=storage;