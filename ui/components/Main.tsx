import { Box, Button, Container, Divider, Typography } from "@material-ui/core";
import { remote } from "electron";
import * as React from "react";
import { Language } from "../../common/l10n";
import { LocalizedProps, withL10n } from "../utils/L10n";
import { FilesArea } from "./FilesArea";
import { LanguageButton } from "./LanguageButton";
import "./Main.scss";
import { ProgressBar } from "./ProgressBar";
import { SearchParametersForm } from "./SearchParametersForm";

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
            <Container className="main__wrapper">
                <Box display="flex" flexDirection="column" height="100%">
                    <Box display="flex" justifyContent="flex-end" mb={1}>
                        <LanguageButton setLanguage={this.handleChangeLanguage} />
                    </Box>

                    <Divider variant="middle" />

                    <Box display="flex" my={1}>
                        <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                            <Typography className="main__folder-caption">
                                {!!this.state.path ? this.state.path : l10n.chooseDir}
                            </Typography>
                        </Box>
                        <Box>
                            <Button onClick={this.handleOpenDialog}>{l10n.open}</Button>
                        </Box>
                    </Box>

                    <Box mb={1}>
                        <Typography align="center">{l10n.dirInfo(1000, 1000)}</Typography>
                    </Box>

                    <SearchParametersForm />
                    <Box mb={1}>
                        <ProgressBar progress={10} />
                    </Box>
                    <FilesArea />
                </Box>
            </Container>
        );
    }
}

export const Main = withL10n(MainImpl);
