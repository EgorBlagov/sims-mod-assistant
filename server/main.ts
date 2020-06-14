import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";
import { ipc } from "../common/ipc";
import { mover } from "./mover";
import { searcher } from "./searcher";

const clientPath = path.join(__dirname, "..", "client");
const isDev = process.env.NODE_ENV === "development";

const launchElectron = () => {
    const createWindow = (): BrowserWindow => {
        const mainWindow = new BrowserWindow({
            minWidth: 640,
            minHeight: 480,
            width: 1024,
            height: 768,
            webPreferences: {
                nodeIntegration: true,
                devTools: isDev,
            },
            icon: path.join(__dirname, "..", "icon.ico"),
        });

        mainWindow.loadFile(path.join(clientPath, "index.html"));

        if (isDev) {
            mainWindow.webContents.openDevTools();
            mainWindow.maximize();
        }

        return mainWindow;
    };

    Menu.setApplicationMenu(new Menu());

    app.whenReady().then(() => {
        const wnd = createWindow();

        searcher.ee.on.searchProgress((data) => ipc.main.emit.searchProgress(wnd, data));
        searcher.ee.on.searchResult((data) => ipc.main.emit.searchResult(wnd, data));
        searcher.ee.on.searchError((data) => ipc.main.emit.searchError(wnd, data));

        ipc.main.handleRpc.getDirectoryInfo(async (args) => {
            return searcher.getDirectoryInfo(args.targetPath);
        });

        ipc.main.handleRpc.startSearch(async (args) => {
            return searcher.startSearch(args.targetPath, args);
        });

        ipc.main.handleRpc.interruptSearch(async () => {
            searcher.interruptSearch();
        });

        ipc.main.handleRpc.moveDuplicates(async (params) => {
            await mover.move(params);
        });
    });

    app.on("window-all-closed", () => {
        app.quit();
    });
};

launchElectron();
