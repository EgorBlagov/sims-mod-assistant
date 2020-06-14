import { Language } from "../../../common/l10n";
import { Actions, ReduxAction } from "../actions";

export type LanguageActions = SettingsSetLanguageAction | SettingsSetStudioPathAction;

export interface SettingsSetLanguageAction extends ReduxAction {
    type: Actions.SETTINGS_SET_LANGUAGE;
    newLanguage: Language;
}

export interface SettingsSetStudioPathAction extends ReduxAction {
    type: Actions.SETTINGS_SET_STUDIO_PATH;
    newPath: string;
}
