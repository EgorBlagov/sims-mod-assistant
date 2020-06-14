import { Box, Button, ListItem, makeStyles, TextField } from "@material-ui/core";
import { remote } from "electron";
import React from "react";
import { getErrorMessage, LocalizedErrors } from "../../../common/errors";
import { ipc } from "../../../common/ipc";
import { isOk } from "../../../common/tools";
import { useL10n } from "../../utils/l10n-hooks";
import { useNotification } from "../../utils/notifications";

const useStyles = makeStyles((theme) => ({
    path: {
        overflowWrap: "anywhere",
        marginRight: theme.spacing(1),
    },
}));

interface IProps {
    studioPath: string;
    setStudioPath: (path: string) => void;
}

export const SimsStudioPathField = ({ studioPath, setStudioPath }: IProps) => {
    const [l10n] = useL10n();
    const classes = useStyles();
    const notification = useNotification();
    const [openDisabled, setOpenDisabled] = React.useState<boolean>(false);

    const selectStudioPath = async () => {
        const openResult = await remote.dialog.showOpenDialog({ properties: ["openDirectory"] });
        if (!openResult.canceled) {
            const pathCandidate = openResult.filePaths[0];

            await ipc.renderer.rpc.isSimsStudioDir(pathCandidate); // raises if invalid
            notification.showSuccess(l10n.studioValidPath);

            setStudioPath(pathCandidate);
        }
    };

    const handleOpenDialog = () => {
        setOpenDisabled(true);

        selectStudioPath()
            .catch((error: LocalizedErrors | Error) => {
                notification.showError(getErrorMessage(error, l10n));
            })
            .finally(() => setOpenDisabled(false));
    };

    return (
        <ListItem>
            <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                <TextField
                    className={classes.path}
                    label={l10n.simsStudioPath}
                    value={isOk(studioPath) ? studioPath : l10n.chooseDir}
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
