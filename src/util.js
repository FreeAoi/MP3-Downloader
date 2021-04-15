const Mustache = require("mustache");
const path = require("path");
const fs = require("fs");

exports.renderComponent = (component, options) =>
    Mustache.render(
        fs.readFileSync(
            path.join(__dirname, "components", `${component}.html`),
            "utf-8"
        ),
        options
    );