import { Language } from "../../../common/l10n";
import { Actions } from "../actions";
import { LanguageActions as SettingsActions } from "./actions";

export interface SettingsState {
    language: Language;
    studioPath: string;
}

export const defaultSettingsState: SettingsState = {
    language: Language.English,
    studioPath: undefined,
};

export const settings = (state = defaultSettingsState, action: SettingsActions): SettingsState => {
    switch (action.type) {
        case Actions.SETTINGS_SET_LANGUAGE:
            return {
                ...state,
                language: action.newLanguage,
            };
        case Actions.SETTINGS_SET_STUDIO_PATH:
            return {
                ...state,
                studioPath: action.newPath,
            };
        default:
            return state;
    }
};
