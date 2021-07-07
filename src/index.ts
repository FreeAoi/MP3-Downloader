import { BrowserWindow, app, ipcMain } from "electron";
import MeowDB from "meowdb";
import path from "path";
import fs from 'fs';

const config = new MeowDB<'raw'>({
    dir: app.getPath('userData'),
    name: "config",
    raw: true
});

let win: BrowserWindow | null;

app.whenReady().then((): void => {
    win = new BrowserWindow({
        width: 900,
        height: 440,
        minWidth: 550,
        minHeight: 440,
        frame: false,
        titleBarStyle: "hidden",
        icon: path.join(__dirname, '../icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile(path.join(__dirname, "client", "index.html"));
});

export { config, app, win };

for(let file of fs.readdirSync(path.join(__dirname, "events"))) {
    let event = require(path.join(__dirname, `events/${file}`));
    ipcMain.on(file.substring(0, file.length - 3), (...args) => event.default(...args))
}

app.on("window-all-closed", () => {
    app.quit();
});