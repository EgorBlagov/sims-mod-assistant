import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";
import { ipc } from "../common/ipc";
import { searcher } from "./searcher";

const clientPath = path.join(__dirname, "..", "client");
const isDev = process.env.NODE_ENV === "development";

const launchElectron = () => {
    const createWindow = () => {
        const mainWindow = new BrowserWindow({
            width: 1024,
            height: 768,
            webPreferences: {
                nodeIntegration: true,
                devTools: isDev,
            },
        });

        mainWindow.loadFile(path.join(clientPath, "index.html"));

        if (isDev) {
            mainWindow.webContents.openDevTools();
            mainWindow.maximize();
        }
    };

    Menu.setApplicationMenu(new Menu());

    ipc.main.getDirectoryInfo(async (args) => {
        return searcher.getDirectoryInfo(args.targetPath);
    });

    app.whenReady().then(() => {
        createWindow();
    });

    app.on("window-all-closed", () => {
        app.quit();
    });
};

launchElectron();
