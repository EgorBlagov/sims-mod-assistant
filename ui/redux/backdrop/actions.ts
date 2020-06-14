import { Actions, ReduxAction } from "../actions";

export type BackdropActions = BackdropSetVisibleAction;

export interface BackdropSetVisibleAction extends ReduxAction {
    type: Actions.BACKDROP_SET_VISIBLE;
    visible: boolean;
}
