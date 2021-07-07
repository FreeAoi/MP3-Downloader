import { GithubResponse } from '../typings/github';
import { config, app } from '../index';
import phin from 'phin';
import path from 'path';
import fs from 'fs';

export default async function(event) {
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
}