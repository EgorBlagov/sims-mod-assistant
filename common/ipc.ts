import { createTypesafeIpc, createTypesafeIpcChannel, createTypesafeIpcEvent } from "./ipc/ipc-creator";
import {
    IDirectoryInfo,
    IDrectoryParams,
    IMoveParams,
    ISearchError,
    ISearchParams,
    ISearchProgress,
    ISearchResult,
    IStartResult,
} from "./types";

export const IpcSchema = {
    rpc: {
        getDirectoryInfo: createTypesafeIpcChannel<IDrectoryParams, IDirectoryInfo>(),
        startSearch: createTypesafeIpcChannel<IDrectoryParams & ISearchParams, IStartResult>(),
        interruptSearch: createTypesafeIpcChannel<void, void>(),
        moveDuplicates: createTypesafeIpcChannel<IMoveParams, void>(),
    },
    mainEvents: {
        searchResult: createTypesafeIpcEvent<ISearchResult>(),
        searchError: createTypesafeIpcEvent<ISearchError>(),
        searchProgress: createTypesafeIpcEvent<ISearchProgress>(),
    },
};

export const ipc = createTypesafeIpc(IpcSchema);
