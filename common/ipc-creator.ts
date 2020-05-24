/* Pretending to be a separate tool */

import { ipcRenderer, ipcMain } from "electron";

type TIpcCallback<TArg, TReturn> = (args: TArg) => Promise<TReturn>;
type TIpcRegisterHandler<TArg, TReturn> = (callback: TIpcCallback<TArg, TReturn>) => void;
type TIpcRendererApi<TArg, TReturn> = TIpcCallback<TArg, TReturn>;
type TIpcMainApi<TArg, TReturn> = TIpcRegisterHandler<TArg, TReturn>;

type TIpcRPCSchema = ReturnType<typeof createTypesafeIpcChannel>;

type TIpcSchema = {
    [channelName: string]: TIpcRPCSchema;
};

type TIpcOutput<T extends TIpcSchema> = {
    renderer: { [K in keyof T]: TIpcRendererApi<T[K]["args"], T[K]["return"]> };
    main: { [K in keyof T]: TIpcMainApi<T[K]["args"], T[K]["return"]> };
};

class IpcCreator<T extends TIpcSchema> {
    public interface: TIpcOutput<T> = {
        main: {},
        renderer: {},
    } as any;

    constructor(ipcSchema: TIpcSchema) {
        for (const channelName of Object.keys(ipcSchema)) {
            this.registerApi(channelName, ipcSchema[channelName]);
        }
    }

    private registerApi<K extends keyof TIpcSchema>(name: K, channelSchema: TIpcRPCSchema): void {
        this.interface.main[name] = this.createTypesafeMainApi(name.toString());
        this.interface.renderer[name] = this.createTypesafeRendererApi(name.toString());
    }

    private createTypesafeMainApi<TArg = void, TReturn = void>(channelName: string): TIpcMainApi<TArg, TReturn> {
        return (callback) => {
            ipcMain.handle(channelName, async (event, args) => {
                return callback(args);
            });
        };
    }

    private createTypesafeRendererApi<TArg = void, TReturn = void>(
        channelName: string,
    ): TIpcRendererApi<TArg, TReturn> {
        return (args) => {
            return ipcRenderer.invoke(channelName, args);
        };
    }
}

export function createTypesafeIpc<T extends TIpcSchema>(ipcSchema: T): TIpcOutput<T> {
    const ipcUtil = new IpcCreator<T>(ipcSchema);
    return ipcUtil.interface;
}

export function createTypesafeIpcChannel<TArg extends any | void, TReturn extends any | void>() {
    return {
        args: (null as any) as TArg,
        return: (null as any) as TReturn,
    };
}
