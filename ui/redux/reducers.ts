import { combineReducers } from "redux";
import { Language } from "../../common/l10n";
import { Actions, LanguageActions, NotificationActions } from "./actions";
import { NotificationTypes } from "./types";

export interface LangaugeState {
    language: Language;
}

const defualtLanguageState: LangaugeState = {
    language: Language.English,
};

const language = (state = defualtLanguageState, action: LanguageActions): LangaugeState => {
    switch (action.type) {
        case Actions.SET_LANGUAGE:
            return {
                ...state,
                language: action.newLanguage,
            };
        default:
            return state;
    }
};

export interface NotificationState {
    message: string;
    type: NotificationTypes;
    visible: boolean;
}

const defaultNotificationState: NotificationState = {
    message: "",
    type: NotificationTypes.Success,
    visible: false,
};

const notification = (state = defaultNotificationState, action: NotificationActions): NotificationState => {
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

export const rootReducer = combineReducers({
    language,
    notification,
});

export type TState = ReturnType<typeof rootReducer>;
