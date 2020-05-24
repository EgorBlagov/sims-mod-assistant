import * as React from "react";
import { ipc } from "../../common/ipc";
import { l10n, Language } from "../../common/l10n";

const LanguageContext = React.createContext(Language.English);

interface IState {
    queriedInfo: string;
    systemInfo: string;
}

class LocalizationTest extends React.Component<IState> {
    static contextType = LanguageContext;
    declare context: React.ContextType<typeof LanguageContext>;

    render() {
        return (
            <div>
                Test Info
                {l10n[this.context].fetchedInfo}
                {this.props.queriedInfo}
                <br />
                {l10n[this.context].systemInfo(this.props.systemInfo)}
            </div>
        );
    }
}

// tslint:disable-next-line: max-classes-per-file
export class App extends React.Component<{}, IState> {
    state: IState = {
        queriedInfo: "Not fetched",
        systemInfo: "Non fetched",
    };

    componentDidMount() {
        ipc.renderer.testRPC().then((data) => {
            this.setState({ queriedInfo: JSON.stringify(data) });
        });

        ipc.renderer.testRPCSytemInfo(10).then((data) => {
            this.setState({ systemInfo: data });
        });
    }

    render() {
        return (
            <LanguageContext.Provider value={Language.Russian}>
                <LocalizationTest {...this.state} />;
            </LanguageContext.Provider>
        );
    }
}
