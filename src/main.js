// Handle Squirrel events for Windows immediately on start
if (require('electron-squirrel-startup')) return;

//全局变量。



const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {autoUpdater} = electron;
const {ipcMain} = electron;
const _ = require('lodash');
const os = require('os');

const logger = require('winston');
const storage = require('./storage');
  
logger.level = 'debug';
global.logger = logger;
var runtime=storage.restore();//运行时配置


// Keep reference of main window because of GC
var mainWindow = null;
var previewindow =null;
var updateFeed = 'http://localhost:3000/updates/latest';
var isDevelopment = process.env.NODE_ENV === 'development';
var feedURL = "";

// Don't use auto-updater if we are in development 
console.log("isDevelopment11", isDevelopment);
  
// Quit when all windows are closed
ipcMain.on('close-window', function() { 
    console.log("receive cmd close window!" ); 
    previewindow.close(); 
    mainWindow.close();
       
});
ipcMain.on("w-minimized", () => {
    mainWindow.minimize(); 
})

ipcMain.on("w-maxed", () => {
    mainWindow.maximize();
});
ipcMain.on('show-preview',()=>{
    previewindow.show();
})
ipcMain.on('hide-preview',()=>{
    previewindow.hide();
})
app.on('window-all-closed',function  () {
    mainWindow = null;
    previewindow = null;
    app.quit();
})
 
// When application is ready, create application window
app.on('ready', function() {
   
    logger.debug("Starting application");
     
    let mwOperation = {
        frame: false,
        width: 1024,
        height: 768,
        thickFrame: true
    }

   if(runtime.bounds){ 
        _.assign(mwOperation,runtime.bounds.mwBound);     
     }
    mainWindow = new BrowserWindow(mwOperation);
     



    // Target HTML file which will be opened in window
    mainWindow.loadURL('file://' + __dirname + "/index.html");

 
     // mainWindow.webContents.openDevTools({detach: true});

    // Cleanup when window is closed
    mainWindow.on('closed', function() {
        storage.save(runtime); 
      
    });
    
    // Cleanup when window is closed
    mainWindow.on('resize', function(e) {
        // console.log(mainWindow.getSize(),mainWindow.getPosition());
        let msz=mainWindow.getSize();
        let osz = previewindow.getSize() ;
        previewindow.setSize(osz[0],msz[1]);

        let mpz=mainWindow.getPosition();
        previewindow.setPosition(mpz[0]+msz[0],mpz[1]);
        _.set(runtime,"bounds.mwBound",mainWindow.getBounds());
        _.set(runtime,"bounds.pwBound",previewindow.getBounds()); 
 
       
    });
    mainWindow.on('move', function(e) {
        let mpz = mainWindow.getPosition();
        let msz = mainWindow.getSize();
        previewindow.setPosition(mpz[0] + msz[0], mpz[1]);
       _.set(runtime,"bounds.mwBound",mainWindow.getBounds());
        _.set(runtime,"bounds.pwBound",previewindow.getBounds());
    })
  


 
    //预览窗口
    let mpz=mainWindow.getPosition();

    let pwOperation={
        x:mpz[0]+1024,
        y:mpz[1],
         width: 800,
         height: 768,
         frame: false,
         show: false,
         parent: mainWindow
     };
    if(runtime.bounds){
        
        _.assign(pwOperation,runtime.bounds.pwBound);
        // previewindow.setBounds(runtime.bounds.pwBound);
        // mainWindow.setBounds(runtime.bounds.mwBound);
     }
     previewindow = new BrowserWindow(pwOperation);
     
     if(runtime.bounds){
        console.log(runtime.bounds);
        previewindow.setBounds(runtime.bounds.pwBound);
        mainWindow.setBounds(runtime.bounds.mwBound);
     }

     
     
     // previewindow.webContents.openDevTools({detach: true});
     previewindow.loadURL('file://' + __dirname + '/preview.html');
     previewindow.on('close', (e) => {
         previewindow.hide();
         e.preventDefault();
     })
     previewindow.on('resize', function(e) {
        // console.log(mainWindow.getSize(),mainWindow.getPosition());
        let msz=mainWindow.getSize();
        let osz = previewindow.getSize() ;
        mainWindow.setSize(msz[0],osz[1]);

        let ppz=previewindow.getPosition();
        mainWindow.setPosition(ppz[0]-msz[0],ppz[1]);
        _.set(runtime,"bounds.mwBound",mainWindow.getBounds());
        _.set(runtime,"bounds.pwBound",previewindow.getBounds());
        // mainWindow = null;
        // previewindow = null;
    });
     

});
