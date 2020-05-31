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
    Exact,
    Catalogue,
}

export interface IFileDescription {
    path: string;
    date: Date;
    basename: string;
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

export interface ISearchResult {
    entries: ISearchEntry[];
}

export interface ISearchProgress {
    ticketId: TTicketId;
    progress: number;
}
