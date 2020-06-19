import { Box, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { clipboard } from "electron";
import React from "react";
import { useL10n } from "../../../utils/l10n-hooks";
import { useNotification } from "../../../utils/notifications";
import { getShowFileHandler } from "../tools";
import { SimsStudioButton } from "./SimsStudioButton";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: theme.spacing(1),
    },
}));

interface IProps {
    path: string;
}

export const DuplicateToolbar = ({ path }: IProps) => {
    const [l10n] = useL10n();
    const notification = useNotification();
    const classes = useStyles();

    const copyPathToClipboard = () => {
        clipboard.writeText(path);
        notification.showSuccess(l10n.copyPathSuccess(path));
    };

    return (
        <Box display="flex" justifyContent="flex-end">
            <SimsStudioButton path={path} className={classes.button} />
            <Tooltip title={l10n.openDirectory} placement="top">
                <IconButton onClick={getShowFileHandler(path)} className={classes.button} size="small" color="primary">
                    <FolderOpenIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={l10n.copyPath} placement="top">
                <IconButton onClick={copyPathToClipboard} className={classes.button} size="small" color="primary">
                    <FileCopyIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
};
