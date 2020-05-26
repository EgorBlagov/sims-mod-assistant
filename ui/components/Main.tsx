import { Box, Button, Container, Divider } from "@material-ui/core";
import { remote } from "electron";
import * as _ from "lodash";
import * as React from "react";
import { Language } from "../../common/l10n";
import { LocalizedProps, withL10n } from "../utils/L10n";
import { LanguageButton } from "./LanguageButton";
import "./Main.scss";

interface IOwnProps {
    setLanguage: (l: Language) => void;
}
type IProps = LocalizedProps<IOwnProps>;

interface IState {
    path: string;
}

class MainImpl extends React.Component<IProps, IState> {
    state: IState = {
        path: undefined,
    };

    handleChangeLanguage = (newLanguage: Language) => {
        this.props.setLanguage(newLanguage);
    };

    handleOpenDialog = () => {
        remote.dialog.showOpenDialog({ properties: ["openDirectory"] }).then((res) => {
            this.setState({ path: res.filePaths && res.filePaths[0] });
        });
    };

    render() {
        const { l10n, lang } = this.props;
        return (
            <Container className="main-wrapper">
                <Box display="flex" justifyContent="flex-end" mb={1}>
                    <LanguageButton setLanguage={this.handleChangeLanguage} />
                </Box>

                <Divider variant="middle" />

                <Box display="flex" mb={1}>
                    <Box flexGrow={1}>{!!this.state.path ? this.state.path : l10n.chooseDir}</Box>
                    <Box>
                        <Button>{l10n.open}</Button>
                    </Box>
                </Box>

                <div uk-grid="true">
                    <div className="uk-width-expand uk-text-center">{l10n.dirInfo(1000, 1000)}</div>
                </div>

                <form>
                    <div className="uk-flex uk-flex-column uk-margin-top">
                        <label>
                            <input className="uk-checkbox uk-margin-small-right" type="checkbox" />
                            {l10n.searchExactDoubles}
                        </label>
                        <label>
                            <input className="uk-checkbox uk-margin-small-right" type="checkbox" />
                            {l10n.searchCatalogueConflicts}
                        </label>
                    </div>
                </form>
                <progress className="uk-progress" value="10" max="100" />
                <div className="uk-flex-1 uk-panel-scrollable">
                    <ul className="uk-list uk-list-divider uk-list-striped uk-list-large">
                        {_.map([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0], (x, i) => (
                            <li key={i}>
                                File {x} {i}
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        );
    }
}

export const Main = withL10n(MainImpl);
