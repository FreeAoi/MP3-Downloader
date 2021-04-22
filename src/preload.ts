import electron from '@electron/remote';
import path from 'path';
import fs from 'fs';

const currentWindow = electron.getCurrentWindow();

// Find all pages in the pages folder and load save HTML and script
const pages: {[index: string]: any} = Object.fromEntries(fs.readdirSync(path.join(__dirname, "pages"))
    .filter((p) => p.match(/\.html$/) && p !== "index.html")
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
    let page:string = "queue";
    (function renderSelectedPage() {
        document.querySelectorAll<HTMLElement>("#main > .menu > div").forEach((element) => {
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
            let elem = document.getElementById("pageContent") as HTMLElement;
            elem.outerHTML = pages[page][0];
            // Script
            pages[page][1]();
        } 
    })();


    // Titlebar
    let minimize_element = document.getElementById("minimize") as HTMLElement;
    let maximize_element = document.getElementById("maximize") as HTMLElement;
    let close_element = document.getElementById("close") as HTMLElement;
    minimize_element.addEventListener("click", () => currentWindow.minimize());
    maximize_element.addEventListener("click", () => {
            if (currentWindow.isMaximized())
                currentWindow.unmaximize();
            else
                currentWindow.maximize();

                maximize_element.classList[currentWindow.isMaximized() ? "add" : "remove"]("max");
        });
        close_element.addEventListener("click", () => currentWindow.close());
});