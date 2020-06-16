import * as _ from "lodash";
import { LocalizedError, LocalizedErrors } from "../../common/errors";
import { createTypesafeEvent, createTypesafeEventEmitter, TypesafeEventEmitter } from "../../common/event-emitter";
import {
    DoubleTypes,
    ISearchError,
    ISearchParams,
    ISearchProgress,
    ISearchResult,
    IStartResult,
    TTicketId,
} from "../../common/types";
import { readDbpf } from "../dbpf";
import { DbpfResourceTypes } from "../dbpf/constants";
import { FileSizes, getFilesAllWithStats } from "../fs-util";
import { DbpfClassifier } from "../indexer/classifiers/dbpf-classifier";
import { Md5Classifier } from "../indexer/classifiers/md5-classifier";
import { Indexer } from "../indexer/indexer";
import { logger } from "../logging";
import { ISavedSearchResult } from "./search-result";

const PROGRESS_FRACTION = 50;

const SearcherEventSchema = {
    searchResult: createTypesafeEvent<TTicketId>(),
    searchProgress: createTypesafeEvent<ISearchProgress>(),
    searchError: createTypesafeEvent<ISearchError>(),
};

export interface ISearcher {
    startSearch(targetPath: string, params: ISearchParams): IStartResult;
    interruptSearch(): void;
    getSearchResult(ticketId: TTicketId): ISearchResult;
    readonly ee: TypesafeEventEmitter<typeof SearcherEventSchema>;
}

class Searcher implements ISearcher {
    private currentSearchTicket: number;
    public readonly ee: TypesafeEventEmitter<typeof SearcherEventSchema>;
    private searchResult: ISavedSearchResult;

    constructor() {
        this.currentSearchTicket = 0;
        this.searchResult = { ticketId: 0, result: undefined };
        this.ee = createTypesafeEventEmitter(SearcherEventSchema);
    }

    startSearch(targetPath: string, params: ISearchParams): IStartResult {
        this.currentSearchTicket++;
        const launchSearchId = this.currentSearchTicket;
        this.startSearchProgress(launchSearchId, targetPath, params)
            .then((result) => {
                this.saveSearchResult(launchSearchId, result);
                this.ee.emit.searchResult(launchSearchId);
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

    getSearchResult(ticketId: TTicketId): ISearchResult {
        if (ticketId !== this.searchResult.ticketId) {
            throw new LocalizedError("invalidTicketId");
        }

        return this.searchResult.result;
    }

    private saveSearchResult(ticketId: number, result: ISearchResult) {
        this.searchResult = {
            ticketId,
            result,
        };
    }

    private async startSearchProgress(
        ticketId: number,
        targetPath: string,
        params: ISearchParams,
    ): Promise<ISearchResult> {
        const allFiles = await getFilesAllWithStats(targetPath);
        const analyzer = this.createIndexer(params);

        let mbPassed = 0;
        const mbTotal = _.reduce(allFiles, (sum, f) => sum + f.stats.size / FileSizes.MB, 0);
        const fractionCount = Math.round(allFiles.length / PROGRESS_FRACTION);
        for (let i = 0; i < allFiles.length; i++) {
            const file = allFiles[i];

            if (ticketId !== this.currentSearchTicket) {
                throw new LocalizedError("searchInterrupted");
            }

            await analyzer.pushFile(file.path);

            mbPassed += file.stats.size / FileSizes.MB;

            if (i % fractionCount === 0) {
                const searchProgress = { ticketId, progressRelative: mbPassed / mbTotal };
                this.ee.emit.searchProgress(searchProgress);
            }
        }

        throw new Error("Not implemented");
    }

    private createIndexer(params: ISearchParams): Indexer {
        const indexer = new Indexer();

        if (params.searchMd5) {
            indexer.setClassifier(DoubleTypes.Exact, new Md5Classifier());
        }

        if (params.searchTgi) {
            indexer.setClassifier(
                DoubleTypes.Catalog,
                new DbpfClassifier([DbpfResourceTypes.Catalog, DbpfResourceTypes.Definition]),
            );
            indexer.setClassifier(DoubleTypes.Skintone, new DbpfClassifier([DbpfResourceTypes.Skintone]));
            indexer.setClassifier(DoubleTypes.Cas, new DbpfClassifier([DbpfResourceTypes.CasPart]));
            indexer.setClassifier(DoubleTypes.Slider, new DbpfClassifier([DbpfResourceTypes.HotSpotControl]));
        }

        indexer.setValidator(async (filepath: string) => {
            await readDbpf(filepath); // now we read dbpf twice, 1 - to validate, 2 - from DbpfClassifier
        });

        return indexer;
    }
}

export const searcher: ISearcher = new Searcher();
