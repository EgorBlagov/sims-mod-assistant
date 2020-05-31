import { Box, Button, Typography } from "@material-ui/core";
import { remote } from "electron";
import * as React from "react";
import { ipc } from "../../common/ipc";
import { isOk } from "../../common/tools";
import { useL10n } from "../utils/L10n";
import { useNotification } from "../utils/notifications";
import "./DirectoryPanel.css";
import { DirectorySummary } from "./DirectorySummary";

export const DirectoryPanel = () => {
    const [l10n, _] = useL10n();
    const notification = useNotification();

    const [path, setPath] = React.useState<string>();
    const [filesCount, setFilesCount] = React.useState<number>();
    const [sizeMb, setSizeMb] = React.useState<number>();
    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (isOk(path)) {
            setFilesCount(undefined);
            setSizeMb(undefined);
            setDialogOpen(true);
            ipc.renderer.rpc
                .getDirectoryInfo({ targetPath: path })
                .then((result) => {
                    setFilesCount(result.filesCount);
                    setSizeMb(result.sizeMb);
                })
                .catch((error: Error) => {
                    notification.showError(l10n.errorPath(error.message));
                    setPath(undefined);
                })
                .finally(() => {
                    setDialogOpen(false);
                });
        }
    }, [path]);

    const handleOpenDialog = () => {
        setDialogOpen(true);
        remote.dialog
            .showOpenDialog({ properties: ["openDirectory"] })
            .then((res) => {
                if (!res.canceled && res.filePaths[0] !== path) {
                    setPath(res.filePaths[0]); // TODO: on path change settings also change due to stack-like design of panels
                    ipc.renderer.rpc.interruptSearch(); // it's Async
                }
                setDialogOpen(false);
            })
            .catch((error: Error) => {
                notification.showError(l10n.errorOpenPath(error.message));
            });
    };

    return (
        <>
            <Box display="flex" my={1}>
                <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                    <Typography className="directory-panel__caption">{isOk(path) ? path : l10n.chooseDir}</Typography>
                </Box>
                <Box>
                    <Button onClick={handleOpenDialog} disabled={dialogOpen}>
                        {l10n.open}
                    </Button>
                </Box>
            </Box>
            {isOk(path) && <DirectorySummary targetPath={path} filesCount={filesCount} sizeMb={sizeMb} />}
        </>
    );
};
