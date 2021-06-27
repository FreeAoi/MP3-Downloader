import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('MP3DownloaderAPI', {
    sendToWindow: (type: string) => ipcRenderer.send('window-buttons', type ?? ''),
    download: (id: string, title: string) => ipcRenderer.send('start-download', { id, title }),
    onProgress: (cb: any) => ipcRenderer.on('download-progress', cb),
		downloadPath: (path: string) => ipcRenderer.send("downloadPath", { path }),
    selectDir: () => ipcRenderer.send("select-directory")
});