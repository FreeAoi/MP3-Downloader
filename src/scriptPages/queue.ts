import { renderComponent, queue } from "../util";

export default function () {
    const container = document.getElementById("videos") as HTMLDivElement;

    function renderResults() {
        if (queue.array().length < 1) return (container.style.flexDirection = "row");
        container.style.flexDirection = "column";
        container.innerHTML = queue.array().map((video) =>
            renderComponent("resultVideo", {
                title: video.title,
                id: video.id,
                author: video.channel!.name,
                authorAvatar: video.channel!.icon.url,
                thumbnail: video.thumbnail!.url,
                downloaded: queue.has(video.id!),
                percentage: queue.has(video.id!) ? queue.get(video.id!)!.progress : 0
            })).join("");
        document.querySelectorAll<HTMLDivElement>("#videos > .video > .buttons > .downloaded")
            .forEach((element) => {
                queue.get(element.parentElement!.parentElement!.id)!
                    .stream.on("progress", (_, downloaded, total) => {
                        element.innerHTML = ((downloaded / total) * 100).toString();
                    });
            });
    }

    // Render everytime the user goes to that page
    renderResults();

    // Check if the status of a video has been changed (when they click the download button)
    queue.onChange(renderResults);
};