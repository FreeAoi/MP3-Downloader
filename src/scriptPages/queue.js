const { renderComponent, queue } = require("../util");

module.exports = () => {
    const container = document.getElementById("videos");

    function renderResults() {
        if (queue.array().length < 1) return (container.style.flexDirection = "row");
        container.style.flexDirection = "column";
        container.innerHTML = queue.array().map((video) =>
            renderComponent("resultVideo", {
                title: video.title,
                id: video.id,
                author: video.channel.name,
                authorAvatar: video.channel.icon.url,
                thumbnail: video.thumbnail.url,
                downloaded: queue.has(video.id),
                percentage: queue.has(video.id) ? queue.get(video.id).progress : 0
            })).join("");
        document.querySelectorAll("#videos > .video > .buttons > .downloaded")
            .forEach((element) => {
                queue.get(element.parentElement.parentElement.id)
                    .stream.on("progress", (_, downloaded, total) => {
                        element.innerHTML = parseInt((downloaded / total) * 100);
                    });
            });
    }

    // Render everytime the user goes to that page
    renderResults();

    // Check if the status of a video has been changed (when they click the download button)
    queue.onChange(renderResults);
};