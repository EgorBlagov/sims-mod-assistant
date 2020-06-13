import { Language } from "../../common/l10n";
import { NotificationTypes } from "./types";

export enum Actions {
    SET_LANGUAGE = "SET_LANGUAGE",
    NOTIFICATION_SET_TYPE = "NOTIFICATION_SET_TYPE",
    NOTIFICATION_SET_MESSAGE = "NOTIFICATION_SET_MESSAGE",
    NOTIFICATION_SET_VISIBLE = "NOTIFICATION_SET_VISIBLE",
}

interface ReduxAction {
    type: Actions;
}

export type LanguageActions = SetLanguageAction;

interface SetLanguageAction extends ReduxAction {
    type: Actions.SET_LANGUAGE;
    newLanguage: Language;
}

export type NotificationActions =
    | NotificationSetTypeAction
    | NotificationSetMessageAction
    | NotificationSetVisibleAction;

interface NotificationSetTypeAction extends ReduxAction {
    type: Actions.NOTIFICATION_SET_TYPE;
    notificationType: NotificationTypes;
}

interface NotificationSetMessageAction extends ReduxAction {
    type: Actions.NOTIFICATION_SET_MESSAGE;
    message: string;
}

interface NotificationSetVisibleAction extends ReduxAction {
    type: Actions.NOTIFICATION_SET_VISIBLE;
    visible: boolean;
}

export namespace ActionCreators {
    export const setLanguage = (newLanguage: Language): SetLanguageAction => ({
        type: Actions.SET_LANGUAGE,
        newLanguage,
    });

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
}
