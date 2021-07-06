import { BrowserWindow, app, ipcMain, dialog } from "electron";
import { GithubResponse } from './typings/github';
import { exec, execFile } from 'child_process';
import { Client } from 'discord-rpc';
import MeowDB from "meowdb";
import path from "path";
import phin from 'phin';
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
        icon: path.join(__dirname, '../icon.png'),
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
    })).login({ clientId: '' }).catch(() => (client = null));

    win.loadFile(path.join(__dirname, "client", "index.html"));
});

ipcMain.on("check-updates", async (event) => {
    const lastUpdate = config.get<number>('lastYTDLUpdate');
    if (lastUpdate && (Date.now() - lastUpdate) < 432e5) return event.sender.send('update-confirmation', true);
    const res: phin.IJSONResponse<GithubResponse> = await phin({
        url: 'https://api.github.com/repos/ytdl-org/youtube-dl/releases?per_page=1',
        parse: 'json', headers: { 'User-Agent': process.platform }
    }).catch(() => null);
    if (!res || !res.body || res.statusCode !== 200)
        return event.sender.send('update-confirmation', false);
    if (res.body[0].tag_name === config.get<string>('YTDLVersion')) return event.sender.send('update-confirmation', true);
    const asset = res.body[0].assets.find((a) => a.name === (process.platform === 'win32' ? 'youtube-dl.exe' : 'youtube-dl'));
    const downloadRes = await phin({
        url: asset.browser_download_url,
        followRedirects: true
    }).catch(() => (event.sender.send('update-confirmation', false), null));
    if (!downloadRes || !downloadRes.body) return event.sender.send('update-confirmation', false);
    fs.writeFile(path.join(app.getPath('userData'), asset.name),
        downloadRes.body, (e) => {
            if (!e) {
                config.set('lastYTDLUpdate', Date.now());
                config.set('YTDLVersion', res.body[0].tag_name);
            }
            event.sender.send('update-confirmation', !e);
        });
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
    const dir = config.get<string>("downloadsDirectory") || app.getPath("downloads");
    const child = exec(path.join(app.getPath('userData'), (process.platform === 'win32' ? 'youtube-dl.exe' : 'youtube-dl'))
        + [' -x', '--audio-format mp3', '--audio-quality 0', `https://www.youtube.com/watch?v=${id}`, `-o ${JSON.stringify(path.join(dir, `${title.match(/[a-z _\-\d]/gi)?.join("").trim()}.ytd.mp3`))}`, '--no-mtime'].join(' '));

    child.stdout.on('data', (data) => {
        const progress = data.toString().match(/\d{1,3}\.\d?%/gi);
        if (progress?.[0])
            event.sender.send("download-progress", {
                id, progress: parseInt(progress[0].slice(0, -1)) / 100
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