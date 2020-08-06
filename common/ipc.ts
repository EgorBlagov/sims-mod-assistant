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
} from "./types";

export const IpcSchema = {
    rpc: {
        getDirectoryInfo: createTypesafeIpcChannel<IDirectoryParams, IDirectoryInfo>(),
        startSearch: createTypesafeIpcChannel<IDirectoryParams & ISearchParams, IStartResult>(),
        interruptSearch: createTypesafeIpcChannel<void, void>(),
        moveDuplicates: createTypesafeIpcChannel<IMoveParams, void>(),
        isSimsStudioDir: createTypesafeIpcChannel<string, void>(),
        openInStudio: createTypesafeIpcChannel<IOpenInStudioParams, void>(),
    },
    mainEvents: {
        searchResult: createTypesafeIpcEvent<IIndexResult>(),
        searchError: createTypesafeIpcEvent<ISearchError>(),
        searchProgress: createTypesafeIpcEvent<ISearchProgress>(),
    },
};

export const ipc = createTypesafeIpc(IpcSchema);
