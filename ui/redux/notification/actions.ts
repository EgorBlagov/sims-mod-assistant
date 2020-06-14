import { Actions, ReduxAction } from "../actions";
import { NotificationTypes } from "../types";

export type NotificationActions =
    | NotificationSetTypeAction
    | NotificationSetMessageAction
    | NotificationSetVisibleAction;

export interface NotificationSetTypeAction extends ReduxAction {
    type: Actions.NOTIFICATION_SET_TYPE;
    notificationType: NotificationTypes;
}

export interface NotificationSetMessageAction extends ReduxAction {
    type: Actions.NOTIFICATION_SET_MESSAGE;
    message: string;
}

export interface NotificationSetVisibleAction extends ReduxAction {
    type: Actions.NOTIFICATION_SET_VISIBLE;
    visible: boolean;
}
