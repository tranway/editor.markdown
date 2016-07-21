// Handle Squirrel events for Windows immediately on start
if (require('electron-squirrel-startup')) return;

//全局变量。



const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {autoUpdater} = electron;
const {ipcMain} = electron;

const os = require('os');

const logger = require('winston');
  
logger.level = 'debug';
global.logger = logger;


// Keep reference of main window because of GC
var mainWindow = null;

var updateFeed = 'http://localhost:3000/updates/latest';
var isDevelopment = process.env.NODE_ENV === 'development';
var feedURL = "";

// Don't use auto-updater if we are in development 
console.log("isDevelopment11", isDevelopment);
  
// Quit when all windows are closed
ipcMain.on('window-all-closed', function() { 
    console.log("receive cmd close window!" ); 
    app.quit();
});
ipcMain.on("window-all-minimized", () => {
    mainWindow.minimize();
})

ipcMain.on("window-all-maxed", () => {
    mainWindow.maximize();
});
 
// When application is ready, create application window
app.on('ready', function() {

    logger.debug("Starting application");
  
    mainWindow = new BrowserWindow({
        frame: false,
        width: 1024,
        height: 768, 
        thickFrame: true
    });

    // Target HTML file which will be opened in window
    mainWindow.loadURL('file://' + __dirname + "/index.html");

    /*mainWindow.setIgnoreMouseEvents(true);*/
    // Uncomment to use Chrome developer tools
    mainWindow.webContents.openDevTools({
        detach: true
    });

    // Cleanup when window is closed
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

});
