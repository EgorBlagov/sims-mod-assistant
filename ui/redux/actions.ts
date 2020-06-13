import { Language } from "../../common/l10n";

export enum Actions {
    SET_LANGUAGE = "SET_LANGUAGE",
}

interface ReduxAction {
    type: Actions;
}

export type ReduxActions = SetLanguageAction;
export interface SetLanguageAction extends ReduxAction {
    newLanguage: Language;
}

export namespace ActionCreators {
    export const setLanguage = (newLanguage: Language): SetLanguageAction => ({
        type: Actions.SET_LANGUAGE,
        newLanguage,
    });
}
