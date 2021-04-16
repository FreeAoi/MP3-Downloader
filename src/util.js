const { app } = require("@electron/remote");
const Mustache = require("mustache");
const ytdl = require("ytdl-core");
const path = require("path");
const fs = require("fs");

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
    stream.pipe(fs.createWriteStream(path.join(app.getPath("downloads"), `${data.title.match(/[a-z _\-\d]/gi).join('')}.ytd.mp3`)));
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

exports.queue = new Map();

exports.renderComponent = (component, options) =>
    Mustache.render(
        fs.readFileSync(
            path.join(__dirname, "components", `${component}.html`),
            "utf-8"
        ),
        options
    );