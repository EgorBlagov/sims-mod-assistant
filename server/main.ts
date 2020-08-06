import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";
import { ipc } from "../common/ipc";
import { getDirectoryInfo } from "./fs-util";
import { mover } from "./mover";
import { simsModIndexer } from "./searcher/searcher";
import { simsStudio } from "./sims-studio/sims-studio";

const clientPath = path.join(__dirname, "..", "client");
const isDev = process.env.NODE_ENV === "development";

const launchElectron = () => {
    const createWindow = (): BrowserWindow => {
        const mainWindow = new BrowserWindow({
            minWidth: 800,
            minHeight: 800,
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

        simsModIndexer.ee.on.searchProgress((data) => ipc.main.emit.searchProgress(wnd, data));
        simsModIndexer.ee.on.searchResult((data) => ipc.main.emit.searchResult(wnd, data));
        simsModIndexer.ee.on.searchError((data) => ipc.main.emit.searchError(wnd, data));

        ipc.main.handleRpc.getDirectoryInfo(async (args) => {
            return getDirectoryInfo(args.targetPath);
        });

        ipc.main.handleRpc.startSearch(async (args) => {
            return simsModIndexer.startSearch(args.targetPath, args);
        });

        ipc.main.handleRpc.interruptSearch(async () => {
            simsModIndexer.interruptSearch();
        });

        ipc.main.handleRpc.moveDuplicates(async (params) => {
            await mover.move(params);
        });

        ipc.main.handleRpc.isSimsStudioDir(async (params) => {
            return simsStudio.validateDir(params);
        });

        ipc.main.handleRpc.openInStudio(async (params) => {
            return simsStudio.openFile(params.filePath, params.simsStudioPath);
        });
    });

    app.on("window-all-closed", () => {
        app.quit();
    });
};

launchElectron();
