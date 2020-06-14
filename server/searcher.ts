import * as fs from "fs";
import * as _ from "lodash";
import * as path from "path";
import { LocalizedError, LocalizedErrors } from "../common/errors";
import { createTypesafeEvent, createTypesafeEventEmitter, TypesafeEventEmitter } from "../common/event-emitter";
import {
    DoubleTypes,
    IDirectoryInfo,
    ISearchError,
    ISearchParams,
    ISearchProgress,
    ISearchResult,
    IStartResult,
} from "../common/types";
import { Analyzer } from "./analyzer";
import { DbpfClassifier } from "./analyzer/classifiers/dbpf-classifier";
import { Md5Classifier } from "./analyzer/classifiers/md5-classifier";
import { readDbpf } from "./dbpf";
import { DbpfResourceTypes } from "./dbpf/constants";
import { logger } from "./logging";
import { IFileWithStats } from "./types";

const MB: number = 1024 * 1024;
const PROGRESS_FRACTION = 50;

const SearcherEventSchema = {
    searchResult: createTypesafeEvent<ISearchResult>(),
    searchProgress: createTypesafeEvent<ISearchProgress>(),
    searchError: createTypesafeEvent<ISearchError>(),
};

export interface ISearcher {
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
        const allFiles = await this.getFilesAllWithStats(targetPath);
        return {
            filesCount: allFiles.length,
            sizeMb: _.reduce(allFiles, (sum, file) => sum + file.stats.size / MB, 0),
        };
    }

    startSearch(targetPath: string, params: ISearchParams): IStartResult {
        this.currentSearchTicket++;
        const launchSearchId = this.currentSearchTicket;
        this.startSearchProgress(launchSearchId, targetPath, params)
            .then((result) => {
                this.ee.emit.searchResult(result);
            })
            .catch((error: LocalizedErrors | Error) => {
                logger.error(error);
                this.ee.emit.searchError({ error, ticketId: launchSearchId });
            });

        return {
            searchTicketId: launchSearchId,
        };
    }

    interruptSearch(): void {
        this.currentSearchTicket++;
    }

    private async getFilesAllWithStats(targetPath: string): Promise<IFileWithStats[]> {
        const allFiles = await this.getAllFilesInDirectory(targetPath);
        return Promise.all(
            _.map(allFiles, async (f) => ({
                path: f.toString(),
                stats: await fs.promises.stat(f),
            })),
        );
    }

    private async startSearchProgress(
        ticketId: number,
        targetPath: string,
        params: ISearchParams,
    ): Promise<ISearchResult> {
        const allFiles = await this.getFilesAllWithStats(targetPath);
        const analyzer = this.createAnalyzer(params);

        let mbPassed = 0;
        const mbTotal = _.reduce(allFiles, (sum, f) => sum + f.stats.size / MB, 0);
        const fractionCount = Math.round(allFiles.length / PROGRESS_FRACTION);
        for (let i = 0; i < allFiles.length; i++) {
            const file = allFiles[i];

            if (ticketId !== this.currentSearchTicket) {
                throw new LocalizedError("searchInterrupted");
            }

            await analyzer.pushFile(file);

            mbPassed += file.stats.size / MB;

            if (i % fractionCount === 0) {
                const searchProgress = { ticketId, progressRelative: mbPassed / mbTotal };
                this.ee.emit.searchProgress(searchProgress);
            }
        }

        return analyzer.summary;
    }

    private createAnalyzer(params: ISearchParams): Analyzer {
        const analyzer = new Analyzer();

        if (params.searchMd5) {
            analyzer.setClassifier("md5-hash", new Md5Classifier(), DoubleTypes.Exact);
        }

        if (params.searchTgi) {
            analyzer.setClassifier(
                "type-group-id-catalog",
                new DbpfClassifier([DbpfResourceTypes.Catalog, DbpfResourceTypes.Definition]),
                DoubleTypes.Catalog,
            );

            analyzer.setClassifier(
                "type-group-skintone",
                new DbpfClassifier([DbpfResourceTypes.Skintone]),
                DoubleTypes.Skintone,
            );

            analyzer.setClassifier("type-group-cas", new DbpfClassifier([DbpfResourceTypes.CasPart]), DoubleTypes.Cas);

            analyzer.setClassifier(
                "type-group-hotspot",
                new DbpfClassifier([DbpfResourceTypes.HotSpotControl]),
                DoubleTypes.Slider,
            );
        }

        analyzer.setValidator(async (f: IFileWithStats) => {
            await readDbpf(f.path.toString()); // now we read dbpf twice, 1 - to validate, 2 - from DbpfClassifier
        });
        return analyzer;
    }
}

export const searcher: ISearcher = new Searcher();
