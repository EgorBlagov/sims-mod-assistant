/* Pretending to be a separate tool */

import { ipcMain, IpcMain, ipcRenderer, IpcRenderer } from "electron";

type TIpcCallback<TArg, TReturn> = (args: TArg) => Promise<TReturn>;
type TIpcRegisterHandler<TArg, TReturn> = (callback: TIpcCallback<TArg, TReturn>) => void;
type TIpcRendererApi<TArg, TReturn> = TIpcCallback<TArg, TReturn>;
type TIpcMainApi<TArg, TReturn> = TIpcRegisterHandler<TArg, TReturn>;

type TIpcEventHandler<TArg> = (args: TArg) => void;
type TIpcEventEmitter<TArg> = (args: TArg) => void;
type TIpcEventOn<TArg> = (handler: TIpcEventHandler<TArg>) => void;
type TIpcEventOff<TArg> = TIpcEventOn<TArg>;

type TIpcSource = IpcMain | IpcRenderer;

type TIpcSchema = {
    rpc: {
        [channelName: string]: ReturnType<typeof createTypesafeIpcChannel>;
    };
    mainEvents: {
        [channelName: string]: ReturnType<typeof createTypesafeIpcEvent>;
    };
};

type TIpcOutput<T extends TIpcSchema> = {
    renderer: {
        rpc: { [K in keyof T["rpc"]]: TIpcRendererApi<T["rpc"][K]["args"], T["rpc"][K]["return"]> };
        on: { [K in keyof T["mainEvents"]]: TIpcEventOn<T["mainEvents"][K]["args"]> };
        off: { [K in keyof T["mainEvents"]]: TIpcEventOff<T["mainEvents"][K]["args"]> };
    };
    main: {
        handleRpc: { [K in keyof T["rpc"]]: TIpcMainApi<T["rpc"][K]["args"], T["rpc"][K]["return"]> };
        emit: { [K in keyof T["mainEvents"]]: TIpcEventEmitter<T["mainEvents"][K]["args"]> };
    };
};

class IpcCreator<T extends TIpcSchema> {
    public interface: TIpcOutput<T> = {
        main: {
            handleRpc: {},
            emit: {},
        },
        renderer: {
            rpc: {},
            on: {},
            off: {},
        },
    } as any;

    constructor(ipcSchema: TIpcSchema) {
        for (const channelName of Object.keys(ipcSchema.rpc)) {
            this.registerApi(channelName);
        }

        for (const channelName of Object.keys(ipcSchema.mainEvents)) {
            this.registerMainEvent(channelName);
        }
    }

    private registerApi<K extends keyof TIpcSchema["rpc"]>(name: K): void {
        this.interface.main.handleRpc[name] = this.createTypesafeMainApi(name.toString());
        this.interface.renderer.rpc[name] = this.createTypesafeRendererApi(name.toString());
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

    private registerMainEvent<K extends keyof TIpcSchema["mainEvents"]>(name: K): void {
        this.interface.main.emit[name] = (arg) => ipcMain.emit(name.toString(), arg);
        this.interface.renderer.on[name] = (callback) =>
            ipcRenderer.on(name.toString(), (event, args) => callback(args));
        this.interface.renderer.off[name] = (callback) =>
            ipcRenderer.removeListener(name.toString(), (event, args) => callback(args));
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

export function createTypesafeIpcEvent<TArg extends any | void>() {
    return {
        args: (null as any) as TArg,
    };
}
