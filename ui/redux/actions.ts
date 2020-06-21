import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { TState } from "./reducers";

export enum Actions {
    SETTINGS_SET_LANGUAGE = "SET_LANGUAGE",
    SETTINGS_SET_STUDIO_PATH = "SETTINGS_SET_STUDIO_PATH",
    NOTIFICATION_SET_TYPE = "NOTIFICATION_SET_TYPE",
    NOTIFICATION_SET_MESSAGE = "NOTIFICATION_SET_MESSAGE",
    NOTIFICATION_SET_VISIBLE = "NOTIFICATION_SET_VISIBLE",
    BACKDROP_SET_VISIBLE = "BACKDROP_SET_VISIBLE",
}

export interface ReduxAction {
    type: Actions;
}

export type ReduxThunkAction<TReturn = void> = ThunkAction<TReturn, TState, unknown, Action<Actions>>;
