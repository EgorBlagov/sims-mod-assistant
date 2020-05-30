import { createTypesafeIpc, createTypesafeIpcChannel } from "./ipc/ipc-creator";
import { IDirectoryInfo, IDrectoryParams, ISearchParams, IStartResult } from "./types";

const IpcSchema = {
    getDirectoryInfo: createTypesafeIpcChannel<IDrectoryParams, IDirectoryInfo>(),
    startSearch: createTypesafeIpcChannel<IDrectoryParams & ISearchParams, IStartResult>(),
};

export const ipc = createTypesafeIpc(IpcSchema);
