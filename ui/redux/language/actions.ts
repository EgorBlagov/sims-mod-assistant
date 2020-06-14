import { Language } from "../../../common/l10n";
import { Actions, ReduxAction } from "../actions";

export type LanguageActions = SetLanguageAction;

export interface SetLanguageAction extends ReduxAction {
    type: Actions.SET_LANGUAGE;
    newLanguage: Language;
}
