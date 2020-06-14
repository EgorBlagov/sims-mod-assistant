import { Language } from "../../../common/l10n";
import { Actions } from "../actions";
import { SetLanguageAction } from "./actions";

export const setLanguage = (newLanguage: Language): SetLanguageAction => ({
    type: Actions.SET_LANGUAGE,
    newLanguage,
});
