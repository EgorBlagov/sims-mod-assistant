const fs = require("fs");

if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
}

fs.copyFileSync("assets/icon.png", "dist/icon.png");
