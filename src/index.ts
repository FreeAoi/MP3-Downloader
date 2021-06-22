require("@electron/remote/main").initialize();

import { BrowserWindow, app, ipcMain } from "electron";
import ytdl from "ytdl-core";
import path from "path";
import fs from 'fs';

app.whenReady().then((): void => {
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
            nodeIntegration: true
        }
    });

    win.loadFile(path.join(__dirname, "client", "index.html"));
    // win.webContents.openDevTools();
});

ipcMain.on("start-download", (event, arg) => {
    const { id, title } = arg;
    const stream = ytdl(`http://www.youtube.com/watch?v=${id}`, {
        filter: "audioonly",
        quality: "highestaudio"
    });
    stream.pipe(fs.createWriteStream(path.join(app.getPath("downloads"), `${title.match(/[a-z _\-\d]/gi)?.join("")}.ytd.mp3`)))

    stream.on("progress", (_, downloaded, total) => {
        event.reply("download-progress", (downloaded / total));
    });
})

app.on("window-all-closed", (): void => {
    app.quit();
});
