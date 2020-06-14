import { useDispatch } from "react-redux";
import * as ActionCreators from "../redux/action-creators";
import { NotificationTypes } from "../redux/types";

interface INotificationApi {
    showError: (msg: string) => void;
    showSuccess: (msg: string) => void;
    showWarning: (msg: string) => void;
}

export function createNotificationApiFromDispatch(dispatch): INotificationApi {
    const show = (type: NotificationTypes) => (msg) => {
        dispatch(ActionCreators.notificationSetType(type));
        dispatch(ActionCreators.notificationSetMessage(msg));
        dispatch(ActionCreators.notificationSetVisible(true));
    };

    return {
        showSuccess: show(NotificationTypes.Success),
        showError: show(NotificationTypes.Error),
        showWarning: show(NotificationTypes.Warning),
    };
}

export function useNotification(): INotificationApi {
    const dispatch = useDispatch();
    return createNotificationApiFromDispatch(dispatch);
}
