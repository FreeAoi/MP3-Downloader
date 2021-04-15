const fs = require("fs");
const ytdl = require("ytdl-core");
const electron = require("electron");
const remote = require("electron").remote;
const currentWindow = remote.getCurrentWindow();

document.addEventListener("DOMContentLoaded", () => {


    // Titlebar buttons
    document.getElementById("minimize").addEventListener("click", () => currentWindow.minimize());
    document.getElementById("maximize").addEventListener("click", () => {
        if(currentWindow.isMaximized()) currentWindow.unmaximize()
        else currentWindow.maximize()
    });

    document.getElementById("close").addEventListener("click", () => currentWindow.close());
    
    document.getElementById("download").addEventListener("click", () => {
        let url = document.getElementById("video_url");
        let temporalId = Date.now();
        document.getElementById("download").setAttribute("disabled", "");
        ytdl(url.value, { filter: "audioonly", quality: "highestaudio"})
          .on("info", (info, _) => {
              let thumbnails = info.videoDetails.thumbnails;
              videoName = info.videoDetails.title;
              console.log(videoName)
              document.getElementById("musics").insertAdjacentHTML("beforeend", `
                <div class="video_container">
                    <div class="thumbnail"><img src="${thumbnails[thumbnails.length - 1].url}" /></div>
                    <div class="name">${info.videoDetails.title}</div>
                    <div id="state">Descargando... 0%</div>
                </div>
              `)
               url.value = "";
          })
          .on("progress", (_, downloaded, total) => {
              let progress = (downloaded / total) * 100;
              document.getElementById("state").innerHTML = `Descargando... ${progress.toFixed(0)}%`
          })
          .on("end", () => {
              let elem = document.getElementById("state");
              elem.innerHTML = "Descarga Completa"
              elem.removeAttribute("id");
              document.getElementById("download").removeAttribute("disabled");
              console.log(videoName)
              let oldPath = `${(electron.app || electron.remote.app).getPath("downloads")}/${temporalId}.mp3`;
              let newPath = `${(electron.app || electron.remote.app).getPath("downloads")}/${videoName.replace(/[^a-zA-Z ]/g, "")}.mp3`;
              fs.renameSync(oldPath, newPath);
          })
          .pipe(fs.createWriteStream(`${(electron.app || electron.remote.app).getPath("downloads")}/${temporalId}.mp3`));
    })

})