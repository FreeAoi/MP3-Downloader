import { BrowserWindow, dialog } from "electron";
import { config, app, win } from '../index';

export default function(event, name) {
    if (!win) return;
    let [dir] = dialog.showOpenDialogSync(win, {
        properties: ["openDirectory"],
    }) || [app.getPath('downloads')];
    config.set(name, dir);
    event.sender.send('update-config', { [name]: dir });
}