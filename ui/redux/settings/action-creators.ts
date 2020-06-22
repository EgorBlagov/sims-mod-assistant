import { Language } from "../../../common/l10n";
import { Actions } from "../actions";
import { SettingsSetLanguageAction, SettingsSetStudioPathAction } from "./actions";

const setLanguage = (newLanguage: Language): SettingsSetLanguageAction => ({
    type: Actions.SETTINGS_SET_LANGUAGE,
    newLanguage,
});

const setSimsStudioPath = (newPath: string): SettingsSetStudioPathAction => ({
    type: Actions.SETTINGS_SET_STUDIO_PATH,
    newPath,
});

export const SettingsActions = {
    setLanguage,
    setSimsStudioPath,
};
