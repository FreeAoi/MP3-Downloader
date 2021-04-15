const electron = require("@electron/remote");
// const ytdl = require("ytdl-core");
const path = require("path");
const fs = require("fs");

const currentWindow = electron.getCurrentWindow();

const pages = Object.fromEntries(fs.readdirSync(path.join(__dirname, "pages"))
    .filter((p) => p.match(/\.html$/, ""))
    .map((p) => [p.replace(/\.html$/, ""), fs.readFileSync(path.join(__dirname, "pages", p), "utf-8")]));

document.addEventListener("DOMContentLoaded", () => {
    // Menu (sidebar)
    let page = "queue";
    function renderSelectedPage() {
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
        if (pages[page])
            document.getElementById("pageContent")
                .outerHTML = pages[page];
    }
    renderSelectedPage();


    // Titlebar
    document.getElementById("minimize")
        .addEventListener("click", () => currentWindow.minimize());
    document.getElementById("maximize")
        .addEventListener("click", () => {
            if (currentWindow.isMaximized())
                currentWindow.unmaximize();
            else
                currentWindow.maximize();

            document.getElementById("maximize").classList[currentWindow.isMaximized() ? "add" : "remove"]("max");
        });
    document.getElementById("close")
        .addEventListener("click", () => currentWindow.close());

    // Logic
    /* document.getElementById("download").addEventListener("click", () => {
        let url = document.getElementById("video_url");
        let temporalId = Date.now();
        const downloadsFolder = (electron.app || electron.remote.app).getPath("downloads");
        document.getElementById("download").setAttribute("disabled", "");

        ytdl(url.value, { filter: "audioonly", quality: "highestaudio" })
            .on("info", (info, _) => {
                let thumbnails = info.videoDetails.thumbnails;
                videoName = info.videoDetails.title;
                console.log(videoName);
                document.getElementById("musics").insertAdjacentHTML("beforeend", `
                <div class="video_container">
                    <div class="thumbnail"><img src="${thumbnails[thumbnails.length - 1].url}" /></div>
                    <div class="name">${info.videoDetails.title}</div>
                    <div id="state">Descargando... 0%</div>
                </div>
              `);
                url.value = "";
            })
            .on("progress", (_, downloaded, total) => {
                let progress = (downloaded / total) * 100;
                document.getElementById("state").innerHTML = `Descargando... ${progress.toFixed(0)}%`;
            })
            .on("end", () => {
                let elem = document.getElementById("state");
                elem.innerHTML = "Descarga Completa";
                elem.removeAttribute("id");
                document.getElementById("download").removeAttribute("disabled");
                console.log(videoName);
                let oldPath = `${downloadsFolder}/${temporalId}.mp3`;
                let newPath = `${downloadsFolder}/${videoName.replace(/[^a-zA-Z ]/g, "")}.mp3`;
                fs.renameSync(oldPath, newPath);
            })
            .pipe(fs.createWriteStream(`${downloadsFolder}/${temporalId}.mp3`));
    }); */
});