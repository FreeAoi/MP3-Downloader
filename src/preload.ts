import { getCurrentWindow } from "@electron/remote";
import path from "path";
import fs from "fs";

const currentWindow = getCurrentWindow();

// Find all pages in the pages folder and load save HTML and script
const pages: { [page: string]: [string, () => any]; } = Object.fromEntries(fs.readdirSync(path.join(__dirname, "pages"))
    .filter((p) => p.match(/\.html$/) && p !== "index.html")
    .map((p) => {
        let module: () => any = () => void 0;
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
        document.querySelectorAll<HTMLDivElement>("#main > .menu > div").forEach((element) => {
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
            let elem = document.getElementById("pageContent") as HTMLDivElement;
            elem.outerHTML = pages[page][0];
            // Script
            pages[page][1]();
        }
    })();


    // Titlebar
    let minimize = document.getElementById("minimize") as HTMLAnchorElement;
    let maximize = document.getElementById("maximize") as HTMLAnchorElement;
    let close = document.getElementById("close") as HTMLAnchorElement;
    minimize.addEventListener("click", () => currentWindow.minimize());
    maximize.addEventListener("click", () => {
        if (currentWindow.isMaximized())
            currentWindow.unmaximize();
        else
            currentWindow.maximize();

        maximize.classList[currentWindow.isMaximized() ? "add" : "remove"]("max");
    });
    close.addEventListener("click", () => currentWindow.close());
});