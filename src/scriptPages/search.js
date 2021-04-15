const { search } = require("youtube-sr").default;
const { renderComponent } = require("../util");

let previousSearch = "";
let previousResults = [];

module.exports = () => {
    const input = document.getElementById("searchBar");
    const button = document.getElementById("searchSubmit");
    const container = document.getElementById("searchResults");

    function renderResults() {
        container.style.flexDirection = "column";
        container.innerHTML = previousResults.map((video) =>
            renderComponent("resultVideo", {
                message: video.title
            })).join("");
    }

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