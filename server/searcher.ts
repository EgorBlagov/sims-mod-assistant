import * as fs from "fs";
import * as _ from "lodash";
import * as path from "path";
import { createTypesafeEvent, createTypesafeEventEmitter, TypesafeEventEmitter } from "../common/event-emitter";
import { IDirectoryInfo, ISearchParams, ISearchProgress, ISearchResult, IStartResult } from "../common/types";
import { logger } from "./logging";

const MB: number = 1024 * 1024;

const SearcherEventSchema = {
    searchResult: createTypesafeEvent<ISearchResult>(),
    searchProgress: createTypesafeEvent<ISearchProgress>(),
    searchError: createTypesafeEvent<string>(),
};

interface ISearcher {
    getDirectoryInfo(targetPath: string): Promise<IDirectoryInfo>;
    startSearch(targetPath: string, params: ISearchParams): IStartResult;
    interruptSearch(): void;
    readonly ee: TypesafeEventEmitter<typeof SearcherEventSchema>;
}

class Searcher implements ISearcher {
    private currentSearchTicket: number;
    public readonly ee: TypesafeEventEmitter<typeof SearcherEventSchema>;
    constructor() {
        this.currentSearchTicket = 0;
        this.ee = createTypesafeEventEmitter(SearcherEventSchema);
    }

    async getAllFilesInDirectory(targetPath: string): Promise<fs.PathLike[]> {
        const result: fs.PathLike[] = [];
        const contents = await fs.promises.readdir(targetPath, { withFileTypes: true });
        for (const entry of contents) {
            const entryPath = path.join(targetPath, entry.name);
            if (entry.isDirectory()) {
                const innerFiles = await this.getAllFilesInDirectory(entryPath);
                result.push(...innerFiles);
            } else {
                result.push(entryPath);
            }
        }

        return result;
    }

    async getDirectoryInfo(targetPath: string): Promise<IDirectoryInfo> {
        const allFiles = await this.getAllFilesInDirectory(targetPath);
        const stats = await Promise.all(_.map(allFiles, (f) => fs.promises.stat(f)));

        return {
            filesCount: allFiles.length,
            sizeMb: _.reduce(stats, (sum, file) => sum + file.size / MB, 0),
        };
    }

    startSearch(targetPath: string, params: ISearchParams): IStartResult {
        this.currentSearchTicket++;

        this.startSearchProgress(this.currentSearchTicket, targetPath, params)
            .then((result) => {
                this.ee.emit.searchResult(result);
            })
            .catch((error) => {
                this.ee.emit.searchError(error);
            });

        return {
            searchTicketId: this.currentSearchTicket,
        };
    }

    interruptSearch(): void {
        this.currentSearchTicket++;
    }

    private async startSearchProgress(
        ticketId: number,
        targetPath: string,
        params: ISearchParams,
    ): Promise<ISearchResult> {
        for (let i = 0; i < 10; i++) {
            await this.timeout(25);
            if (ticketId !== this.currentSearchTicket) {
                logger.warn("Search interrupted");
                return;
            }
            this.ee.emit.searchProgress({ ticketId, progress: (i + 1) * 10 });
        }
        await this.timeout(50);

        return {
            duplicates: [],
            skips: [],
        };
    }

    private timeout(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export const searcher: ISearcher = new Searcher();
