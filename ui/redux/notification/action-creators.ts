import { Actions } from "../actions";
import { NotificationTypes } from "../types";
import { NotificationSetMessageAction, NotificationSetTypeAction, NotificationSetVisibleAction } from "./actions";

const setType = (type: NotificationTypes): NotificationSetTypeAction => ({
    type: Actions.NOTIFICATION_SET_TYPE,
    notificationType: type,
});

const setVisible = (visible: boolean): NotificationSetVisibleAction => ({
    type: Actions.NOTIFICATION_SET_VISIBLE,
    visible,
});

const setMessage = (message: string): NotificationSetMessageAction => ({
    type: Actions.NOTIFICATION_SET_MESSAGE,
    message,
});

export const NotificationActions = {
    setType,
    setVisible,
    setMessage,
};
