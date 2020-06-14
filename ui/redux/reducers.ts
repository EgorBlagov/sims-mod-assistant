import { combineReducers } from "redux";
import { backdrop } from "./backdrop/reducers";
import { language } from "./language/reducers";
import { notification } from "./notification/reducers";

export const rootReducer = combineReducers({
    language,
    notification,
    backdrop,
});

export type TState = ReturnType<typeof rootReducer>;
