import { createTypesafeIpcChannel, createTypesafeIpc } from "./ipc-creator";

const IpcSchema = {
    testRPC: createTypesafeIpcChannel<void, number[]>(),
    testRPCSytemInfo: createTypesafeIpcChannel<number, string>(),
};

export const ipc = createTypesafeIpc(IpcSchema);
