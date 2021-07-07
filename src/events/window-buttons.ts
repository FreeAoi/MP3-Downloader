import { BrowserWindow } from 'electron';
import { win } from '../index';

export default function(_, type:string) {
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
}