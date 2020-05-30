import { Event } from "electron";
import * as React from "react";
import { ipc, IpcSchema } from "../common/ipc";

type IpcMainEvents = typeof IpcSchema["mainEvents"];

export function useIpcEvent<K extends keyof IpcMainEvents>(
    eventName: K,
    handler: (event: Event, args: IpcMainEvents[K]["args"]) => void,
    deps?: React.DependencyList,
): void {
    React.useEffect(() => {
        ipc.renderer.on[eventName](handler);
        return () => ipc.renderer.off[eventName](handler);
    }, deps);
}
