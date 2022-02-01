import { config, app } from '../index';
import ffmpeg from 'fluent-ffmpeg';
import ytdlCore from 'ytdl-core';
import path from 'path';

export default function(event, { id, title }: { id: string; title: string; }) {
    const dir = config.get<string>("downloadsDirectory") || app.getPath("downloads")
    const ffmpegPath = path.join(app.getPath('userData'), "ffmpeg");

    const stream = ytdlCore(`https://www.youtube.com/watch?v=${id}`, {
        quality: "highestaudio",
        filter: "audioonly"
    });
    stream.on("progress", (_, downloaded, total) => {
        event.sender.send("download-progress", {
            id,
            progress: downloaded / total
        });
    })

    ffmpeg(stream).setFfmpegPath(ffmpegPath)
        .audioBitrate(128)
        .save(path.join(dir, `${title.match(/[a-z _\-\d]/gi)?.join("").trim()}.ytd.mp3`))
        .on('error', function (err, stdout, stderr) {
            console.log(stdout, stderr);
            console.log('Cannot process video: ' + err.message);
        });
}