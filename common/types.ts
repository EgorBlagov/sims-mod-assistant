import { LocalizedErrors } from "./errors";

export interface IDirectoryInfo {
    filesCount: number;
    sizeMb: number;
}

export type TTicketId = number;

export interface IStartResult {
    searchTicketId: TTicketId;
}

export interface IDrectoryParams {
    targetPath: string;
}

export interface ISearchParams {
    searchMd5: boolean;
    searchTgi: boolean;
}

export enum DoubleTypes {
    Exact = "Exact",
    Catalog = "Catalog",
    Skintone = "Skintone",
    Cas = "Cas",
    Slider = "Slider",
}

export interface IFileDescription {
    path: string;
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

export interface ISearchResult {
    duplicates: ISearchEntry[];
    skips: ISkippedFile[];
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
    targetDir: string;
}
