import storage from "electron-json-storage";
import _ from "lodash";
import { isOk } from "../../../common/tools";
import { defaultSettingsState, SettingsState } from "../../redux/settings/reducers";

const SETTINGS_FILENAME = "settings";

const get = () =>
    new Promise<object>((resolve, reject) => {
        storage.get(SETTINGS_FILENAME, (err, data) => {
            if (isOk(err)) {
                reject(err);
            }

            resolve(data);
        });
    });

const set = (newSettings) =>
    new Promise((resolve, reject) => {
        storage.set(SETTINGS_FILENAME, newSettings, (err) => {
            if (isOk(err)) {
                reject(err);
            }
            resolve();
        });
    });

export const loadSettings = async (): Promise<SettingsState> => {
    const settings: SettingsState = defaultSettingsState;
    const loaded = await get();
    const result = { ...settings, ...loaded };
    if (!_.isEqual(loaded, result)) {
        await set(result);
    }

    return result;
};

export const saveSettings = async (settings: SettingsState) => {
    await set(settings);
};
