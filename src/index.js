require("@electron/remote/main").initialize();

const { BrowserWindow, app } = require("electron");
const path = require("path");

require("electron-reload")(__dirname);

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 900,
        height: 480,
        minWidth: 360,
        minHeight: 440,
        frame: false,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            enableRemoteModule: true,
            nodeIntegration: false
        }
    });

    win.loadFile(path.join(__dirname, "pages", "index.html"));
    // win.webContents.openDevTools();
});

app.on("window-all-closed", () => {
    app.quit();
});