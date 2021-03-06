import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import { remote } from "electron";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ipc } from "../../common/ipc";
import { isOk } from "../../common/tools";
import { ConflictResolverActions } from "../redux/conflict-resolver/action-creators";
import { TState } from "../redux/reducers";
import { useBackdropBound } from "../utils/backdrop-hooks";
import { useL10n } from "../utils/l10n-hooks";
import { useNotification } from "../utils/notifications";
import { DirectorySummary } from "./DirectorySummary";

const useStyles = makeStyles({
    root: {
        overflowWrap: "anywhere",
    },
});

export const DirectoryPanel = () => {
    const [l10n] = useL10n();
    const notification = useNotification();

    const path = useSelector((state: TState) => state.conflictResolver.searchDirectory);
    const dispatch = useDispatch();
    const setPath = (newPath: string) => dispatch(ConflictResolverActions.setSearchDirectory(newPath));

    const [filesCount, setFilesCount] = React.useState<number>();
    const [sizeMb, setSizeMb] = React.useState<number>();
    const [openDisabled, setOpenDisabled] = React.useState<boolean>(false);

    const directoryPathStyles = useStyles();

    React.useEffect(() => {
        if (isOk(path)) {
            setFilesCount(undefined);
            setSizeMb(undefined);
            setOpenDisabled(true);
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
                    setOpenDisabled(false);
                });
        }
    }, [path]);

    useBackdropBound(openDisabled);

    const handleOpenDialog = () => {
        setOpenDisabled(true);

        remote.dialog
            .showOpenDialog({ properties: ["openDirectory"] })
            .then((res) => {
                if (!res.canceled && res.filePaths[0] !== path) {
                    setPath(res.filePaths[0]); // TODO: on path change settings also change due to stack-like design of panels, consider redux integration
                    ipc.renderer.rpc.interruptSearch(); // it's Async
                }
            })
            .catch((error: Error) => {
                notification.showError(l10n.errorOpenPath(error.message));
            })
            .finally(() => setOpenDisabled(false));
    };

    return (
        <>
            <Box display="flex" my={1}>
                <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                    <Typography className={directoryPathStyles.root}>{isOk(path) ? path : l10n.chooseDir}</Typography>
                </Box>
                <Box>
                    <Button onClick={handleOpenDialog} disabled={openDisabled}>
                        {l10n.open}
                    </Button>
                </Box>
            </Box>
            {isOk(path) && <DirectorySummary filesCount={filesCount} sizeMb={sizeMb} />}
        </>
    );
};
