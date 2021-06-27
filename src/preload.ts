import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('MP3DownloaderAPI', {
    sendToWindow: (type: string) => ipcRenderer.send('window-buttons', type ?? ''),
    download: (id: string, title: string) => ipcRenderer.send('start-download', { id, title }),
    selectDirectory: (name: string) => ipcRenderer.send("select-directory", name),
    onProgress: (cb: any) => ipcRenderer.on('download-progress', cb),
    onConfigUpdate: (cb: any) => ipcRenderer.on('update-config', cb),
    setPresence: (data: Record<string, string>) => ipcRenderer.send('update-discordrpc', data),
    requestConfig: () => ipcRenderer.send('request-config')
});
