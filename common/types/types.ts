import { LocalizedErrors } from "../errors";
import { TIndex } from "../indexer/types";
import { DoubleTypes, TTicketId } from "./basic-types";
import { IDuplicateGroup } from "./graph-types";

export interface IDirectoryInfo {
    filesCount: number;
    sizeMb: number;
}

export interface IStartResult {
    searchTicketId: TTicketId;
}

export interface IDirectoryParams {
    targetPath: string;
}

export interface ISearchParams {
    searchMd5: boolean;
    searchTgi: boolean;
}

export interface IFileDescription {
    path: string;
}

export interface IFileAdditionalInfo {
    modifiedDate: Date;
}

export interface IFileDuplicate extends IFileDescription {
    duplicateChecks: {
        [K in keyof typeof DoubleTypes]: boolean;
    };
}

export interface ISearchEntry {
    original: IFileDescription;
    duplicates: IFileDuplicate[];
}

export enum SkipReasons {
    UnsupportedSimsVersion,
    NotPackage,
    UnableToParse,
}

export interface ISkippedFile extends IFileDescription {
    reason: SkipReasons;
}

export interface IIndexResult {
    ticketId: TTicketId;
    index: TIndex;
    skips: ISkippedFile[];
    fileInfos: Record<string, IFileAdditionalInfo>;
}

export interface ISearchResult extends IIndexResult {
    duplicates: IDuplicateGroup[];
}

export interface ISearchProgress {
    ticketId: TTicketId;
    progressRelative: number;
}

export interface ISearchError {
    error: LocalizedErrors | Error;
    ticketId: TTicketId;
}

export interface IMoveParams {
    filePaths: string[];
    searchDir: string;
    targetDir: string;
}

export interface IOpenInStudioParams {
    filePath: string;
    simsStudioPath: string;
}

export enum IndexChanges {
    Remove = "Remove",
}

export interface IIndexUpdate {
    [path: string]: IIndexChange;
}

export interface IIndexChange {
    change: IndexChanges;
}
