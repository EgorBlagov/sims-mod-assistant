import { getErrorMessage } from "../../../common/errors";
import { ipc } from "../../../common/ipc";
import { l10n } from "../../../common/l10n";
import { isOk } from "../../../common/tools";
import { createNotificationApiFromDispatch } from "../../utils/notifications";
import { loadSettings, saveSettings } from "../../utils/settings/settings";
import { ReduxThunkAction } from "../actions";
import { SettingsActions } from "../settings/action-creators";

const loadLanguage = (): ReduxThunkAction<Promise<void>> => async (dispatch) => {
    const loaded = await loadSettings();
    dispatch(SettingsActions.setLanguage(loaded.language));
};

const loadRestAndValidate = (): ReduxThunkAction<Promise<void>> => async (dispatch, getStore) => {
    const translation = l10n[getStore().settings.language];
    const notification = createNotificationApiFromDispatch(dispatch);
    const loaded = await loadSettings();

    if (isOk(loaded.studioPath)) {
        try {
            await ipc.renderer.rpc.isSimsStudioDir(loaded.studioPath);
            dispatch(SettingsActions.setSimsStudioPath(loaded.studioPath));
        } catch (error) {
            dispatch(SettingsActions.setSimsStudioPath(undefined));
            notification.showWarning(translation.studioDisabled(getErrorMessage(error, translation)));
        }
    }

    await saveSettings(getStore().settings);
};

export const SettingsThunk = {
    loadLanguage,
    loadRestAndValidate,
};
