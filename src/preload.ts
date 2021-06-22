const { getCurrentWindow } = require("@electron/remote");
const currentWindow = getCurrentWindow();

document.addEventListener("DOMContentLoaded", () => {
    let minimize = document.getElementById("minimize") as HTMLAnchorElement;
    let maximize = document.getElementById("maximize") as HTMLAnchorElement;
    let close = document.getElementById("close") as HTMLAnchorElement;
    minimize.addEventListener("click", () => currentWindow.minimize());
    maximize.addEventListener("click", (e) => {
        if (currentWindow.isMaximized()) currentWindow.unmaximize();
        else currentWindow.maximize();
    });
    close.addEventListener("click", () => currentWindow.close());
});