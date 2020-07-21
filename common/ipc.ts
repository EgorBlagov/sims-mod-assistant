import { createTypesafeIpc, createTypesafeIpcChannel, createTypesafeIpcEvent } from "./ipc/ipc-creator";
import {
    IDirectoryInfo,
    IDirectoryParams,
    IIndexResult,
    IMoveParams,
    IOpenInStudioParams,
    ISearchError,
    ISearchParams,
    ISearchProgress,
    IStartResult,
    TTicketId,
} from "./types";

export const IpcSchema = {
    rpc: {
        getDirectoryInfo: createTypesafeIpcChannel<IDirectoryParams, IDirectoryInfo>(),
        startSearch: createTypesafeIpcChannel<IDirectoryParams & ISearchParams, IStartResult>(),
        interruptSearch: createTypesafeIpcChannel<void, void>(),
        moveDuplicates: createTypesafeIpcChannel<IMoveParams, void>(),
        isSimsStudioDir: createTypesafeIpcChannel<string, void>(),
        getSearchResult: createTypesafeIpcChannel<TTicketId, IIndexResult>(),
        openInStudio: createTypesafeIpcChannel<IOpenInStudioParams, void>(),
    },
    mainEvents: {
        searchResult: createTypesafeIpcEvent<TTicketId>(),
        searchError: createTypesafeIpcEvent<ISearchError>(),
        searchProgress: createTypesafeIpcEvent<ISearchProgress>(),
    },
};

export const ipc = createTypesafeIpc(IpcSchema);
