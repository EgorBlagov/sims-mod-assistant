import { Actions } from "../actions";
import { NotificationTypes } from "../types";
import { NotificationActions } from "./actions";

interface NotificationState {
    message: string;
    type: NotificationTypes;
    visible: boolean;
}

const defaultNotificationState: NotificationState = {
    message: "",
    type: NotificationTypes.Success,
    visible: false,
};

export const notification = (state = defaultNotificationState, action: NotificationActions): NotificationState => {
    switch (action.type) {
        case Actions.NOTIFICATION_SET_MESSAGE:
            return {
                ...state,
                message: action.message,
            };
        case Actions.NOTIFICATION_SET_TYPE:
            return {
                ...state,
                type: action.notificationType,
            };
        case Actions.NOTIFICATION_SET_VISIBLE:
            return {
                ...state,
                visible: action.visible,
            };
        default:
            return state;
    }
};
