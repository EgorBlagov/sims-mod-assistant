import { Box, Button, ListItem, makeStyles, TextField } from "@material-ui/core";
import { remote } from "electron";
import React from "react";
import { isOk } from "../../../common/tools";
import { useL10n } from "../../utils/l10n-hooks";
import { useNotification } from "../../utils/notifications";

const useStyles = makeStyles((theme) => ({
    path: {
        overflowWrap: "anywhere",
        marginRight: theme.spacing(1),
    },
}));

export const SimsStudioPathField = () => {
    const [l10n] = useL10n();
    const classes = useStyles();
    const notification = useNotification();

    const [simsStudioPath, setSimsStudioPath] = React.useState<string>();
    const [openDisabled, setOpenDisabled] = React.useState<boolean>(false);
    const handleOpenDialog = () => {
        setOpenDisabled(true);

        remote.dialog
            .showOpenDialog({ properties: ["openDirectory"] })
            .then((res) => {
                if (!res.canceled && res.filePaths[0] !== simsStudioPath) {
                    setSimsStudioPath(res.filePaths[0]);
                }
            })
            .catch((error: Error) => {
                notification.showError(l10n.errorOpenPath(error.message));
            })
            .finally(() => setOpenDisabled(false));
    };

    return (
        <ListItem>
            <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                <TextField
                    className={classes.path}
                    error={true}
                    label={l10n.simsStudioPath}
                    value={isOk(simsStudioPath) ? simsStudioPath : l10n.chooseDir}
                    helperText={l10n.simsStudioExeNotFound}
                    disabled={true}
                />
            </Box>
            <Box>
                <Button onClick={handleOpenDialog} disabled={openDisabled}>
                    {l10n.open}
                </Button>
            </Box>
        </ListItem>
    );
};
