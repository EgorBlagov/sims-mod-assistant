import storage from "electron-json-storage";
import _ from "lodash";
import { Language } from "../../common/l10n";
import { isOk } from "../../common/tools";

const SETTINGS_FILENAME = "settings";

export interface ISettings {
    language: Language;
}

const defaultSettings: ISettings = {
    language: Language.English,
};

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

export const loadSettings = async (): Promise<ISettings> => {
    const settings: ISettings = defaultSettings;
    const loaded = await get();
    const result = { ...settings, ...loaded };
    if (!_.isEqual(loaded, result)) {
        await set(result);
    }

    return result;
};

export const saveSettings = async (settings: ISettings) => {
    await set(settings);
};
