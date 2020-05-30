import * as fs from "fs";
import * as path from "path";
import { ipc } from "../common/ipc";
import { IDirectoryInfo, ISearchParams, ISearchResult, IStartResult } from "../common/types";
import { logger } from "./logging";

const MB: number = 1024 * 1024;

interface ISearcher {
    getDirectoryInfo(targetPath: string): Promise<IDirectoryInfo>;
    startSearch(targetPath: string, params: ISearchParams): IStartResult;
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

    startSearch(targetPath: string, params: ISearchParams): IStartResult {
        this.currentSearchTicket++;

        this.startSearchProgress(targetPath, params)
            .then((result) => {
                ipc.main.emit.searchResult(result); // remove IPC from business logic
            })
            .catch((error) => {
                ipc.main.emit.searchError(error);
            });

        return {
            searchTicketId: this.currentSearchTicket,
        };
    }

    private async startSearchProgress(targetPath: string, params: ISearchParams): Promise<ISearchResult> {
        return {};
    }
}

export const searcher: ISearcher = new Searcher();
