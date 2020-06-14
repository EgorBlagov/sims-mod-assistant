import { Actions } from "../actions";
import { NotificationTypes } from "../types";
import { NotificationSetMessageAction, NotificationSetTypeAction, NotificationSetVisibleAction } from "./actions";

export const notificationSetType = (type: NotificationTypes): NotificationSetTypeAction => ({
    type: Actions.NOTIFICATION_SET_TYPE,
    notificationType: type,
});

export const notificationSetVisible = (visible: boolean): NotificationSetVisibleAction => ({
    type: Actions.NOTIFICATION_SET_VISIBLE,
    visible,
});

export const notificationSetMessage = (message: string): NotificationSetMessageAction => ({
    type: Actions.NOTIFICATION_SET_MESSAGE,
    message,
});
