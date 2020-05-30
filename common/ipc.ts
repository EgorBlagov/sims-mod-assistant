import { createTypesafeIpc, createTypesafeIpcChannel, createTypesafeIpcEvent } from "./ipc/ipc-creator";
import { IDirectoryInfo, IDrectoryParams, ISearchParams, ISearchResult, IStartResult } from "./types";

const IpcSchema = {
    rpc: {
        getDirectoryInfo: createTypesafeIpcChannel<IDrectoryParams, IDirectoryInfo>(),
        startSearch: createTypesafeIpcChannel<IDrectoryParams & ISearchParams, IStartResult>(),
    },
    mainEvents: {
        searchResult: createTypesafeIpcEvent<ISearchResult>(),
        searchError: createTypesafeIpcEvent<string>(),
    },
};

export const ipc = createTypesafeIpc(IpcSchema);
