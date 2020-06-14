import React from "react";
import { useDispatch } from "react-redux";
import { getErrorMessage } from "../../../common/errors";
import { ipc } from "../../../common/ipc";
import { isOk } from "../../../common/tools";
import * as ActionCreators from "../../redux/action-creators";
import { SettingsState } from "../../redux/settings/reducers";
import { useL10n } from "../l10n-hooks";
import { useNotification } from "../notifications";
import { loadSettings, saveSettings } from "./settings";

export const useLoadSettings = () => {
    const dispatch = useDispatch();
    const [l10n] = useL10n();
    const [loaded, setLoaded] = React.useState<SettingsState>(undefined);
    const notification = useNotification();

    // load only language (to localize errors and warnings)
    React.useEffect(() => {
        loadSettings()
            .then((loadedSettings) => {
                dispatch(ActionCreators.settingsSetLanguage(loadedSettings.language));
                setLoaded(loadedSettings);
            })
            .catch((err) => notification.showError(getErrorMessage(err, l10n)));
    }, []);

    // load the rest
    const loadRestRoutine = async () => {
        if (isOk(loaded.studioPath)) {
            try {
                await ipc.renderer.rpc.isSimsStudioDir(loaded.studioPath);
                dispatch(ActionCreators.settingsSetSimsStudioPath(loaded.studioPath));
            } catch (error) {
                notification.showWarning(l10n.studioDisabled(getErrorMessage(error, l10n)));
                dispatch(ActionCreators.settingsSetSimsStudioPath(undefined));
            }
        }

        await saveSettings(loaded);
    };

    React.useEffect(() => {
        if (isOk(loaded)) {
            loadRestRoutine().catch((err) => notification.showError(getErrorMessage(err, l10n)));
        }
    }, [loaded]);
};
