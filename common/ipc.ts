import { createTypesafeIpc, createTypesafeIpcChannel } from "./ipc/ipc-creator";
import { IDirectoryInfo } from "./types";

const IpcSchema = {
    getDirectoryInfo: createTypesafeIpcChannel<{ path: string }, IDirectoryInfo>(),
};

export const ipc = createTypesafeIpc(IpcSchema);
