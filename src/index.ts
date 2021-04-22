require("@electron/remote/main").initialize();

import { BrowserWindow, app } from "electron";
import path from "path";

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 900,
        height: 440,
        minWidth: 550,
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