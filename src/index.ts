import { BrowserWindow, app, ipcMain, dialog } from "electron";
import { Client } from 'discord-rpc';
import ytdl from "ytdl-core";
import MeowDB from "meowdb";
import path from "path";
import fs from 'fs';

const config = new MeowDB<'raw'>({
    dir: app.getPath('userData'),
    name: "config",
    raw: true
});

let win: BrowserWindow | null;
let client: Client | null;

app.whenReady().then((): void => {
    win = new BrowserWindow({
        width: 900,
        height: 440,
        minWidth: 550,
        minHeight: 440,
        frame: false,
        titleBarStyle: "hidden",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    client = new Client({ transport: 'ipc' });

    client.on('ready', () => client.setActivity({
        state: 'Opening MP3Downloader',
        startTimestamp: Date.now()
    })).login({ clientId: '' });

    win.loadFile(path.join(__dirname, "client", "index.html"));
});

ipcMain.on("select-directory", (event, name) => {
    if (!win) return;
    let [dir] = dialog.showOpenDialogSync(win, {
        properties: ["openDirectory"],
    }) || [app.getPath('downloads')];
    config.set(name, dir);
    event.sender.send('update-config', { [name]: dir });
});

ipcMain.on("start-download", (event, { id, title }: { id: string; title: string; }) => {
    const stream = ytdl(`https://www.youtube.com/watch?v=${id}`, {
        filter: "audioonly",
        quality: "highestaudio"
    });

    let dir = config.get<string>("downloadDir") || app.getPath("downloads");
    stream.pipe(fs.createWriteStream(path.join(dir, `${title.match(/[a-z _\-\d]/gi)?.join("")}.ytd.mp3`)));

    stream.on("progress", (_, downloaded, total) => {
        if (!isNaN(downloaded) && !isNaN(total))
            event.sender.send("download-progress", {
                id, progress: (downloaded / total)
            });
    });
});

ipcMain.on("window-buttons", (_, type: string) => {
    if (!win) return;
    switch (type) {
        case 'minimize':
            win.minimize();
            break;
        case 'maximize':
            if (win.isMaximized()) win.unmaximize();
            else win.maximize();
            break;
        case 'close':
            win.close();
            break;
    }
});

ipcMain.on('update-discordrpc', (_, data: { page: 'queue' | 'search' | 'settings'; videos: number; }) => {
    if (!client || config.create('disableDiscordRPC', false)) return;
    client.setActivity({
        state: `On ${data.page} page`,
        details: `Videos queued ${data.videos}`,
    });
});

ipcMain.on('request-config', (event) =>
    event.sender.send('update-config', config.all()));

app.on("window-all-closed", () => {
    app.quit();
});
