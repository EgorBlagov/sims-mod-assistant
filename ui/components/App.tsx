import * as React from "react";
import { Language } from "../../common/l10n";
import { LanguageContext } from "../utils/L10n";
import { Main } from "./Main";

interface IState {
    currentLanguage: Language;
}

export class App extends React.Component<{}, IState> {
    state: IState = {
        currentLanguage: Language.English,
    };

    setLanguage = (newLanguage: Language) => {
        this.setState({ currentLanguage: newLanguage });
    };

    render() {
        return (
            <LanguageContext.Provider value={this.state.currentLanguage}>
                <Main setLanguage={this.setLanguage} />
            </LanguageContext.Provider>
        );
    }
}
