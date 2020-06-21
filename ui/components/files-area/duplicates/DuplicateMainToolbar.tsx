import { AppBar, Box, Button, makeStyles } from "@material-ui/core";
import { remote } from "electron";
import React from "react";
import { ipc } from "../../../../common/ipc";
import { useBackdropBound } from "../../../utils/backdrop-hooks";
import { useL10n } from "../../../utils/l10n-hooks";
import { useNotification } from "../../../utils/notifications";

interface IProps {
    selectedPaths: string[];
    setChecked: (checked: boolean) => void;
}

const useStyles = makeStyles((theme) => ({
    spacingRight: {
        marginRight: theme.spacing(1),
    },
}));

export const DuplicateMainToolbar = ({ selectedPaths, setChecked }: IProps) => {
    const [l10n] = useL10n();
    const classes = useStyles();

    const notification = useNotification();
    const [moveDisabled, setMoveDisabled] = React.useState<boolean>(false);
    useBackdropBound(moveDisabled);

    const moveItems = async () => {
        setMoveDisabled(true);
        try {
            const dialogResult = await remote.dialog.showOpenDialog({ properties: ["openDirectory"] });
            if (!dialogResult.canceled) {
                await ipc.renderer.rpc.moveDuplicates({
                    targetDir: dialogResult.filePaths[0],
                    filePaths: selectedPaths,
                });
                notification.showSuccess(l10n.moveSuccess);
                // TODO: view update logic
            }
        } finally {
            setMoveDisabled(false);
        }
    };

    const openDalog = () => {
        moveItems().catch((err) => notification.showError(l10n.errorMove(err.message)));
    };

    const selectAll = () => setChecked(true);
    const clearSelection = () => setChecked(false);

    return (
        <AppBar color="transparent" position="static">
            <Box display="flex" p={2}>
                <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.spacingRight}
                    size="small"
                    onClick={selectAll}
                >
                    {l10n.selectAll}
                </Button>

                <Button variant="outlined" color="secondary" size="small" onClick={clearSelection}>
                    {l10n.clearSelection}
                </Button>
                <Box flexGrow={1} />
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={openDalog}
                    disabled={moveDisabled || selectedPaths.length === 0}
                >
                    {l10n.moveDuplicates}
                </Button>
            </Box>
        </AppBar>
    );
};
