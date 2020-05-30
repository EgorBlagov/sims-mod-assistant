import { createTypesafeIpc, createTypesafeIpcChannel, createTypesafeIpcEvent } from "./ipc/ipc-creator";
import { IDirectoryInfo, IDrectoryParams, ISearchParams, ISearchProgress, ISearchResult, IStartResult } from "./types";

export const IpcSchema = {
    rpc: {
        getDirectoryInfo: createTypesafeIpcChannel<IDrectoryParams, IDirectoryInfo>(),
        startSearch: createTypesafeIpcChannel<IDrectoryParams & ISearchParams, IStartResult>(),
    },
    mainEvents: {
        searchResult: createTypesafeIpcEvent<ISearchResult>(),
        searchError: createTypesafeIpcEvent<string>(),
        searchProgress: createTypesafeIpcEvent<ISearchProgress>(),
    },
};

export const ipc = createTypesafeIpc(IpcSchema);
