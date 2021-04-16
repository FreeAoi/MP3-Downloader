const electron = require("@electron/remote");
const path = require("path");
const fs = require("fs");

const currentWindow = electron.getCurrentWindow();

const pages = Object.fromEntries(fs.readdirSync(path.join(__dirname, "pages"))
    .filter((p) => p.match(/\.html$/, "") && p !== "index.html")
    .map((p) => {
        let module = () => void 0;
        try {
            let tempModule = require(`./scriptPages/${p.replace(/\.html$/, "")}.js`);
            if (tempModule instanceof Function)
                module = tempModule;
        } catch { }
        return [
            p.replace(/\.html$/, ""),
            [fs.readFileSync(path.join(__dirname, "pages", p), "utf-8"), module]
        ];
    }));

document.addEventListener("DOMContentLoaded", () => {
    // Menu (sidebar)
    let page = "queue";
    (function renderSelectedPage() {
        document.querySelectorAll("#main > .menu > div")
            .forEach((element) => {
                // Selected page
                if (element.id === page)
                    element.classList.add("selected");
                else
                    element.classList.remove("selected");

                // Handle onclick (change page)
                element.onclick = () => {
                    page = element.id;
                    renderSelectedPage();
                };
            });
        if (pages[page]) {
            // Content
            document.getElementById("pageContent")
                .outerHTML = pages[page][0];
            // Script
            pages[page][1]();
        }
    })();


    // Titlebar
    document.getElementById("minimize")
        .addEventListener("click", () => currentWindow.minimize());
    document.getElementById("maximize")
        .addEventListener("click", () => {
            if (currentWindow.isMaximized())
                currentWindow.unmaximize();
            else
                currentWindow.maximize();

            document.getElementById("maximize")
                .classList[currentWindow.isMaximized() ? "add" : "remove"]("max");
        });
    document.getElementById("close")
        .addEventListener("click", () => currentWindow.close());
});