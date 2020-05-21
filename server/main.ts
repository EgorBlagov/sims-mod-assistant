import { app, BrowserWindow } from "electron";
import * as express from "express";
import * as path from "path";
import { AddressInfo } from "net";

const expressApp = express();
const clientPath = path.join(__dirname, "client");
expressApp.use(express.static(clientPath));
expressApp.get("/api", (req, res) => {
    res.json({ info: "Sims4 Mod Assistant" });
});

expressApp.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});

const launchElectron = (port: number) => {
    const createWindow = () => {
        // Create the browser window.
        const mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                devTools: true,
            },
        });

        const url = new URL(`http://localhost:${port}`);
        url.searchParams.set("port", port.toString());
        mainWindow.loadURL(url.toString());
    };

    app.whenReady().then(() => {
        createWindow();

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });

    app.on("window-all-closed", () => {
        app.quit();
    });
};

const server = expressApp.listen(0, () => {
    const port = (server.address() as AddressInfo).port;
    launchElectron(port);
});
