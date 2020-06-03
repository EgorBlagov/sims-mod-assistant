import * as fs from "fs";
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
        logger.info(`Directory Info: ${targetPath}: total size: ${result.sizeMb.toFixed(2)} MB`);
        return result;
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
            entries: [
                {
                    original: {
                        date: new Date(),
                        path: "C://1",
                        basename: "1",
                    },
                    duplicates: [
                        {
                            date: new Date(),
                            path: "C://2",
                            basename: "2",
                            duplicateChecks: { Catalog: true, Exact: false },
                        },
                        {
                            date: new Date(),
                            path: "C://3",

                            basename: "3",
                            duplicateChecks: { Catalog: true, Exact: true },
                        },
                    ],
                },
                {
                    original: {
                        date: new Date(),
                        path: "C://4",
                        basename: "4",
                    },
                    duplicates: [
                        {
                            date: new Date(),
                            path: "C://5",

                            basename: "5",
                            duplicateChecks: { Catalog: true, Exact: true },
                        },
                        {
                            date: new Date(),
                            path: "C://6",

                            basename: "6",
                            duplicateChecks: { Catalog: false, Exact: true },
                        },
                    ],
                },
            ],
        };
    }

    private timeout(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export const searcher: ISearcher = new Searcher();
