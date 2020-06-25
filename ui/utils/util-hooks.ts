import { useEffect, useReducer } from "react";

export const useForceUpdate = (deps: any[]) => {
    const [key, increaseKey] = useReducer((state) => state + 1, 0);
    useEffect(() => {
        increaseKey();
    }, deps);

    return key;
};
