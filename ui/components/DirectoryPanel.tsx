import { Box, Button, Typography } from "@material-ui/core";
import { remote } from "electron";
import * as React from "react";
import { LocalizedProps, withL10n } from "../utils/L10n";
import "./DirectoryPanel.css";

type IProps = LocalizedProps<{}>;

interface IState {
    path: string;
}

class DirectoryPanelImpl extends React.Component<IProps, IState> {
    state: IState = {
        path: undefined,
    };

    handleOpenDialog = () => {
        remote.dialog.showOpenDialog({ properties: ["openDirectory"] }).then((res) => {
            this.setState({ path: res.filePaths && res.filePaths[0] });
        });
    };

    render() {
        const { l10n } = this.props;
        return (
            <>
                <Box display="flex" my={1}>
                    <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                        <Typography className="directory-panel__caption">
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
            </>
        );
    }
}
export const DirectoryPanel = withL10n(DirectoryPanelImpl);
