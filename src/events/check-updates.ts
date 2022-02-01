import { config, app } from '../index';
import { createGunzip } from 'zlib';
import stream from 'stream';
import util from 'util';
import phin from 'phin';
import path from 'path';
import os from 'os';
import fs from 'fs';

const pipelineAsync = util.promisify(stream.pipeline);

export default async function (event) {

    try {
        const res = await phin({
            url: 'https://api.github.com/repos/eugeneware/ffmpeg-static/releases?per_page=1',
            parse: 'json', headers: { 'User-Agent': process.platform }
        });

        if (!res || !res.body || res.statusCode !== 200) return event.sender.send('update-confirmation', false);
        if (res.body[0].tag_name === config.get<string>('FFMPEGVersion')) return event.sender.send('update-confirmation', true);
        const asset = res.body[0].assets.find((a) => a.name === `${os.platform()}-${os.arch()}.gz`);

        const downloadRes = await phin({
            url: asset.browser_download_url,
            followRedirects: true,
            stream: true,
            timeout: 30 * 1000
        })

        if (!downloadRes) return event.sender.send('update-confirmation', false);
        const file = fs.createWriteStream(path.join(app.getPath('userData'), "ffmpeg"))
        await pipelineAsync(downloadRes, createGunzip(), file);
        fs.chmodSync(path.join(app.getPath('userData'), "ffmpeg"), 0o755);
        config.set('FFMPEGVersion', res.body[0].tag_name);
        event.sender.send('update-confirmation', true);
        
    } catch (e) {
        console.error(e);
        event.sender.send('update-confirmation', false);
    }
}