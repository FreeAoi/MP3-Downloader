const { app, BrowserWindow } = require("electron");
const path = require("path");

require('electron-reload')(__dirname);

app.whenReady().then(() => {
    const windows = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true,
            nodeIntegration: false
        }
    })

    windows.loadFile("index.html")
    windows.webContents.openDevTools()
})

app.on('window-all-closed', () => {
	app.quit()
})