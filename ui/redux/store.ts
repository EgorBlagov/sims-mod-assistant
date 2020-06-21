import { Action, applyMiddleware, createStore } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { Actions } from "./actions";
import { rootReducer, TState } from "./reducers";

export const store = createStore(rootReducer, applyMiddleware(thunk as ThunkMiddleware<TState, Action<Actions>>));
