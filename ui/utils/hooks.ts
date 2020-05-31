import * as React from "react";
import { ipc, IpcSchema } from "../../common/ipc";
import { TIpcEventHandler, TIpcOutput, TIpcSchema } from "../../common/ipc/ipc-creator";

type TIpcHooksOutput<T extends TIpcSchema> = {
    use: {
        [K in keyof T["mainEvents"]]: (handler: TIpcEventHandler<T["mainEvents"][K]["args"]>) => void;
    };
};

type TIpcRenderer<T extends TIpcSchema> = TIpcOutput<T>["renderer"];

class IpcHooksCreator<T extends TIpcSchema> {
    public interface: TIpcHooksOutput<T> = { use: {} } as TIpcHooksOutput<T>;

    constructor(schema: T, ipcRendererTypesafe: TIpcRenderer<T>) {
        for (const channelName of Object.keys(schema.mainEvents)) {
            this.createHook(ipcRendererTypesafe, channelName);
        }
    }

    private createHook<K extends keyof TIpcSchema["mainEvents"]>(ipcRendererTypesafe: TIpcRenderer<T>, name: K): void {
        this.interface.use[name] = (handler) => {
            React.useEffect(() => {
                ipcRendererTypesafe.on[name](handler);
                return () => ipcRendererTypesafe.off[name](handler);
            });
        };
    }
}

function createTypsafeHooks<T extends TIpcSchema>(
    ipcSchema: T,
    ipcRendererTypesafe: TIpcRenderer<T>,
): TIpcHooksOutput<T> {
    const hooksCreator = new IpcHooksCreator<T>(ipcSchema, ipcRendererTypesafe);
    return hooksCreator.interface;
}

export const ipcHooks = createTypsafeHooks(IpcSchema, ipc.renderer);
