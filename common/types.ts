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
