import { combineReducers } from "redux";
import { backdrop } from "./backdrop/reducers";
import { conflictResolver } from "./conflict-resolver/reducers";
import { notification } from "./notification/reducers";
import { settings } from "./settings/reducers";

export const rootReducer = combineReducers({
    settings,
    notification,
    backdrop,
    conflictResolver,
});

export type TState = ReturnType<typeof rootReducer>;
