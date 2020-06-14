import { combineReducers } from "redux";
import { backdrop } from "./backdrop/reducers";
import { notification } from "./notification/reducers";
import { settings } from "./settings/reducers";

export const rootReducer = combineReducers({
    settings,
    notification,
    backdrop,
});

export type TState = ReturnType<typeof rootReducer>;
