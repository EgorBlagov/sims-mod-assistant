import { BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";
import { ipc } from "../common/ipc";
import { IDirectoryInfo, ISearchParams, ISearchResult, IStartResult } from "../common/types";
import { logger } from "./logging";

const MB: number = 1024 * 1024;

interface ISearcher {
    getDirectoryInfo(targetPath: string): Promise<IDirectoryInfo>;
    startSearch(targetPath: string, params: ISearchParams, mainWindow: BrowserWindow): IStartResult;
}

class Searcher implements ISearcher {
    private currentSearchTicket: number;

    constructor() {
        this.currentSearchTicket = 0;
    }

    async getDirectoryInfo(targetPath: string): Promise<IDirectoryInfo> {
        const result: IDirectoryInfo = {
            filesCount: 0,
            sizeMb: 0,
        };

        const contents = await fs.promises.readdir(targetPath, { withFileTypes: true });
        for (const entry of contents) {
            const entryPath = path.join(targetPath, entry.name);
            if (entry.isDirectory()) {
                const subDir = await this.getDirectoryInfo(entryPath);
                result.filesCount += subDir.filesCount;
                result.sizeMb += subDir.sizeMb;
            } else {
                result.filesCount++;
                result.sizeMb += (await fs.promises.stat(entryPath)).size / MB;
            }
        }
        logger.info(`Directory Info: ${targetPath}: total size: ${result.sizeMb} MB`);
        return result;
    }

    startSearch(targetPath: string, params: ISearchParams, wnd: BrowserWindow): IStartResult {
        this.currentSearchTicket++;

        this.startSearchProgress(this.currentSearchTicket, targetPath, params, wnd)
            .then((result) => {
                ipc.main.emit.searchResult(wnd, result); // remove IPC from business logic
            })
            .catch((error) => {
                ipc.main.emit.searchError(wnd, error);
            });

        return {
            searchTicketId: this.currentSearchTicket,
        };
    }

    private async startSearchProgress(
        ticketId: number,
        targetPath: string,
        params: ISearchParams,
        wnd: BrowserWindow,
    ): Promise<ISearchResult> {
        for (let i = 0; i < 10; i++) {
            await this.timeout(1000); // TEMPORARY
            ipc.main.emit.searchProgress(wnd, { ticketId, progress: (i + 1) * 10 }); // remove IPC from business logic
        }

        return {};
    }

    private timeout(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export const searcher: ISearcher = new Searcher();
