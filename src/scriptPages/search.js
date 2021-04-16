const { renderComponent, queue } = require("../util");
const { search } = require("youtube-sr").default;

let previousSearch = "";
let previousResults = [];

module.exports = () => {
    const input = document.getElementById("searchBar");
    const button = document.getElementById("searchSubmit");
    const container = document.getElementById("videos");

    function renderResults() {
        container.style.flexDirection = "column";
        container.innerHTML = previousResults.map((video) =>
            renderComponent("resultVideo", {
                title: video.title,
                id: video.id,
                author: video.channel.name,
                authorAvatar: video.channel.icon.url,
                thumbnail: video.thumbnail.url,
                downloaded: queue.has(video.id),
                percentage: queue.has(video.id) ? queue.get(video.id).progress : 0
            })).join("");
        document.querySelectorAll("#videos > .video > .buttons > .download")
            .forEach((element) =>
                element.onclick = () => {
                    if (queue.has(element.parentElement.parentElement.id)) return;
                    queue.add(element.parentElement.parentElement.id, previousResults.find((v) => v.id === element.parentElement.parentElement.id));
                });
        document.querySelectorAll("#videos > .video > .buttons > .downloaded")
            .forEach((element) => {
                queue.get(element.parentElement.parentElement.id)
                    .stream.on("progress", (_, downloaded, total) => {
                        element.innerHTML = parseInt((downloaded / total) * 100);
                    });
            });
    }

    // Check if the status of a video has been changed (when they click the download button)
    queue.onChange(renderResults);

    // Render Previous Things if the user changes the page
    if (previousResults.length > 1) {
        input.value = previousSearch;
        renderResults(previousResults);
    }

    // Search when the user press Enter
    input.onkeydown = (e) => (e.key === "Enter" ? button.click() : void 0);

    // Search
    button.onclick = async () => {
        if (!input.value || previousSearch.toLowerCase() === input.value.toLowerCase()) return;
        previousSearch = input.value;
        button.setAttribute("disabled", "");
        const results = await search(input.value, {
            type: "video",
            limit: 12,
            safeSearch: true
        });
        previousResults = results;
        button.removeAttribute("disabled");
        renderResults(previousResults);
    };
};