import { Box, Button, Typography } from "@material-ui/core";
import { remote } from "electron";
import * as React from "react";
import { isOk } from "../../common/tools";
import { LocalizedProps, withL10n } from "../utils/L10n";
import "./DirectoryPanel.css";
import { DirectorySummary } from "./DirectorySummary";

type IProps = LocalizedProps<{}>;

interface IState {
    path: string;
    filesCount: number;
    sizeMb: number;
}

class DirectoryPanelImpl extends React.Component<IProps, IState> {
    state: IState = {
        path: undefined,
        filesCount: undefined,
        sizeMb: undefined,
    };

    handleOpenDialog = () => {
        remote.dialog.showOpenDialog({ properties: ["openDirectory"] }).then((res) => {
            this.setState({ path: res.filePaths && res.filePaths[0] });
        });
    };

    componentDidUpdate(_: IProps, prevState: IState) {
        if (isOk(this.state.path) && this.state.path !== prevState.path) {
            // TODO: implement fetch directory info
        }
    }

    render() {
        const { l10n } = this.props;
        const { path, filesCount, sizeMb } = this.state;

        return (
            <>
                <Box display="flex" my={1}>
                    <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                        <Typography className="directory-panel__caption">{!!path ? path : l10n.chooseDir}</Typography>
                    </Box>
                    <Box>
                        <Button onClick={this.handleOpenDialog}>{l10n.open}</Button>
                    </Box>
                </Box>
                {!!path && (
                    <Box mb={10} display="flex" justifyContent="center">
                        <DirectorySummary filesCount={filesCount} sizeMb={sizeMb} />
                    </Box>
                )}
            </>
        );
    }
}
export const DirectoryPanel = withL10n(DirectoryPanelImpl);
