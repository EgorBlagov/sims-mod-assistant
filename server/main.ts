import { app, BrowserWindow } from "electron";
import * as os from "os";
import * as path from "path";
import { ipc } from "../common/ipc";

const clientPath = path.join(__dirname, "..", "client");
const isDev = process.env.NODE_ENV === "development";
const launchElectron = () => {
    const createWindow = () => {
        const mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                devTools: isDev,
            },
        });

        mainWindow.loadFile(path.join(clientPath, "index.html"));

        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    };

    ipc.main.testRPC(async () => {
        return [10, 20, 30];
    });

    ipc.main.testRPCSytemInfo(async (num) => {
        return `Info: given number ${num}, os type: ${os.type()}, platform: ${os.platform()}`;
    });

    app.whenReady().then(() => {
        createWindow();
    });

    app.on("window-all-closed", () => {
        app.quit();
    });
};

launchElectron();
