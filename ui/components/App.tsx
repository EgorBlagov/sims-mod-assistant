import * as React from "react";
import { ipc } from "../../common/ipc";
import { Language } from "../../common/l10n";
import { LanguageContext } from "../utils/L10n";
import { Main } from "./Main";

interface IState {
    queriedInfo: string;
    systemInfo: string;
    currentLanguage: Language;
}

export class App extends React.Component<{}, IState> {
    state: IState = {
        queriedInfo: "Not fetched",
        systemInfo: "Non fetched",
        currentLanguage: Language.English,
    };

    componentDidMount() {
        ipc.renderer.testRPC().then((data) => {
            this.setState({ queriedInfo: JSON.stringify(data) });
        });

        ipc.renderer.testRPCSytemInfo(10).then((data) => {
            this.setState({ systemInfo: data });
        });

        setTimeout(() => this.setState({ currentLanguage: Language.Russian }), 5000);
    }

    render() {
        return (
            <LanguageContext.Provider value={this.state.currentLanguage}>
                <Main info1={this.state.queriedInfo} info2={this.state.systemInfo} />;
            </LanguageContext.Provider>
        );
    }
}
