import { config, app } from '../index';
import { exec } from 'child_process';
import path from 'path';

export default function(event, { id, title }: { id: string; title: string; }) {
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
}