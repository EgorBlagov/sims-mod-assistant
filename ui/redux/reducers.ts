import { combineReducers } from "redux";
import { Language } from "../../common/l10n";
import { Actions, ReduxActions } from "./actions";

export interface LangaugeState {
    language: Language;
}

const defualtLanguageState: LangaugeState = {
    language: Language.English,
};

const language = (state = defualtLanguageState, action: ReduxActions): LangaugeState => {
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

export const rootReducer = combineReducers({
    language,
});

export type TState = ReturnType<typeof rootReducer>;
