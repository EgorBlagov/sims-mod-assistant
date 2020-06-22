import { useDispatch } from "react-redux";
import { NotificationActions } from "../redux/notification/action-creators";
import { NotificationTypes } from "../redux/types";

interface INotificationApi {
    showError: (msg: string) => void;
    showSuccess: (msg: string) => void;
    showWarning: (msg: string) => void;
}

export function createNotificationApiFromDispatch(dispatch): INotificationApi {
    const show = (type: NotificationTypes) => (msg) => {
        dispatch(NotificationActions.setType(type));
        dispatch(NotificationActions.setMessage(msg));
        dispatch(NotificationActions.setVisible(true));
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
