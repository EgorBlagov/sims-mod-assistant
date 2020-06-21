import { getErrorMessage } from "../../../common/errors";
import { ipc } from "../../../common/ipc";
import { l10n, Language } from "../../../common/l10n";
import { isOk } from "../../../common/tools";
import { createNotificationApiFromDispatch } from "../../utils/notifications";
import { loadSettings, saveSettings } from "../../utils/settings/settings";
import { Actions, ReduxThunkAction } from "../actions";
import { SettingsSetLanguageAction, SettingsSetStudioPathAction } from "./actions";

export const settingsSetLanguage = (newLanguage: Language): SettingsSetLanguageAction => ({
    type: Actions.SETTINGS_SET_LANGUAGE,
    newLanguage,
});

export const settingsSetSimsStudioPath = (newPath: string): SettingsSetStudioPathAction => ({
    type: Actions.SETTINGS_SET_STUDIO_PATH,
    newPath,
});

export const settingsLoadLanguage = (): ReduxThunkAction<Promise<void>> => async (dispatch) => {
    const loaded = await loadSettings();
    dispatch(settingsSetLanguage(loaded.language));
};

export const settingsLoadRestAndValidate = (): ReduxThunkAction<Promise<void>> => async (dispatch, getStore) => {
    const translation = l10n[getStore().settings.language];
    const notification = createNotificationApiFromDispatch(dispatch);
    const loaded = await loadSettings();

    if (isOk(loaded.studioPath)) {
        try {
            await ipc.renderer.rpc.isSimsStudioDir(loaded.studioPath);
            dispatch(settingsSetSimsStudioPath(loaded.studioPath));
        } catch (error) {
            dispatch(settingsSetSimsStudioPath(undefined));
            notification.showWarning(translation.studioDisabled(getErrorMessage(error, translation)));
        }
    }

    await saveSettings(getStore().settings);
};
