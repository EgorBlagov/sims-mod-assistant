import { Language } from "../../../common/l10n";
import { Actions } from "../actions";
import { LanguageActions } from "./actions";

interface LangaugeState {
    language: Language;
}

const defualtLanguageState: LangaugeState = {
    language: Language.English,
};

export const language = (state = defualtLanguageState, action: LanguageActions): LangaugeState => {
    switch (action.type) {
        case Actions.SET_LANGUAGE:
            return {
                ...state,
                language: action.newLanguage,
            };
        default:
            return state;
    }
};
