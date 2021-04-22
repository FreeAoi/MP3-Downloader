import { app } from "@electron/remote";
import { Video } from "youtube-sr";
import Mustache from "mustache";
import ytdl from "ytdl-core";
import path from "path";
import fs from "fs";

Map.prototype._listeners = [];
Map.prototype.onChange = function (callback) {
    this._listeners.push(callback);
};
Map.prototype.change = function () {
    this._listeners
        .filter((l) => (l instanceof Function))
        .forEach((l) => l());
};
Map.prototype.array = function () {
    return [...this.values()];
};
Map.prototype.add = function (id, data) {
    const stream = ytdl(`http://www.youtube.com/watch?v=${id}`, {
        filter: "audioonly",
        quality: "highestaudio"
    });
    stream.pipe(fs.createWriteStream(path.join(app.getPath("downloads"), `${data.title!.match(/[a-z _\-\d]/gi)?.join("")}.ytd.mp3`)));
    data.progress = 0;
    stream.on("progress", (_, downloaded, total) => {
        data.progress = (downloaded / total) * 100;
    });
    data.stream = stream;
    this.set(id, data);
    this.change();
};
Map.prototype.remove = function (id) {
    this.delete(id);
    this.change();
};

export const queue = new Map<string, Video>();

export const renderComponent = (component: string, options: Record<string, any>) =>
    Mustache.render(
        fs.readFileSync(
            path.join(__dirname, "components", `${component}.html`),
            "utf-8"
        ),
        options
    );