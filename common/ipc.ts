import { createTypesafeIpc, createTypesafeIpcChannel } from "./ipc/ipc-creator";

const IpcSchema = {
    testRPC: createTypesafeIpcChannel<void, number[]>(),
    testRPCSytemInfo: createTypesafeIpcChannel<number, string>(),
};

export const ipc = createTypesafeIpc(IpcSchema);
