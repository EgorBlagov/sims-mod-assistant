import { Box, Button, Typography } from "@material-ui/core";
import { remote } from "electron";
import * as React from "react";
import { ipc } from "../../common/ipc";
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
            this.setState({ filesCount: undefined, sizeMb: undefined });
            ipc.renderer.getDirectoryInfo({ targetPath: this.state.path }).then((result) => {
                this.setState({ filesCount: result.filesCount, sizeMb: result.sizeMb });
            });
        }
    }

    render() {
        const { l10n } = this.props;
        const { path, filesCount, sizeMb } = this.state;

        return (
            <>
                <Box display="flex" my={1}>
                    <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                        <Typography className="directory-panel__caption">
                            {isOk(path) ? path : l10n.chooseDir}
                        </Typography>
                    </Box>
                    <Box>
                        <Button onClick={this.handleOpenDialog}>{l10n.open}</Button>
                    </Box>
                </Box>
                {isOk(path) && <DirectorySummary targetPath={path} filesCount={filesCount} sizeMb={sizeMb} />}
            </>
        );
    }
}
export const DirectoryPanel = withL10n<{}>(DirectoryPanelImpl);
