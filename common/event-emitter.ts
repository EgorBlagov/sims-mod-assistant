import { EventEmitter } from "events";

interface EventSchema {
    [eventName: string]: any;
}

type TEmit<T> = (data: T) => void;
type TOnOff<T> = (handler: (data: T) => void) => void;

export type TypesafeEventEmitter<T extends EventSchema> = {
    emit: {
        [K in keyof T]: TEmit<T[K]>;
    };
    on: {
        [K in keyof T]: TOnOff<T[K]>;
    };
    off: {
        [K in keyof T]: TOnOff<T[K]>;
    };
    ee: EventEmitter;
};

export function createTypesafeEvent<T extends any>() {
    return null as T;
}

export function createTypesafeEventEmitter<T extends EventSchema>(schema: T): TypesafeEventEmitter<T> {
    const result: TypesafeEventEmitter<T> = {
        ee: new EventEmitter(),
        emit: {},
        on: {},
        off: {},
    } as TypesafeEventEmitter<T>;
    for (const eventName of Object.keys(schema)) {
        const eventKey: keyof T = eventName;
        result.emit[eventKey] = (data) => result.ee.emit(eventKey.toString(), data);
        result.on[eventKey] = (handler) => result.ee.on(eventKey.toString(), handler);
        result.off[eventKey] = (handler) => result.ee.off(eventKey.toString(), handler);
    }

    return result;
}
