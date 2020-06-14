import { Language } from "../../../common/l10n";
import { Actions } from "../actions";
import { SettingsSetLanguageAction, SettingsSetStudioPathAction } from "./actions";

export const settingsSetLanguage = (newLanguage: Language): SettingsSetLanguageAction => ({
    type: Actions.SETTINGS_SET_LANGUAGE,
    newLanguage,
});

export const settingsSetSimsStudioPath = (newPath: string): SettingsSetStudioPathAction => ({
    type: Actions.SETTINGS_SET_STUDIO_PATH,
    newPath,
});
