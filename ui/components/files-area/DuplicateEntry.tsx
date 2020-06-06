import { Box, Chip, ListItem, ListItemText, Tooltip, Typography } from "@material-ui/core";
import * as React from "react";
import { IFileDuplicate } from "../../../common/types";
import { useL10n } from "../../utils/L10n";
import { getShowFileHandler, usePathStyles } from "./tools";

interface IProps {
    duplicate: IFileDuplicate;
}

export const DuplicateEntry = ({ duplicate }: IProps) => {
    const [l10n, __] = useL10n();
    const classes = usePathStyles();

    return (
        <ListItem button={true} onClick={getShowFileHandler(duplicate.path)}>
            <ListItemText className={classes.base} primary={duplicate.basename} secondary={l10n.date(duplicate.date)} />

            <Tooltip title={duplicate.path}>
                <Typography color="textSecondary" className={classes.path}>
                    {duplicate.path}
                </Typography>
            </Tooltip>

            {duplicate.duplicateChecks.Catalog && (
                <Tooltip title={l10n.catalogDuplicateDescription}>
                    <Box ml={1}>
                        <Chip size="small" label={l10n.catalogDuplicate} color="primary" />
                    </Box>
                </Tooltip>
            )}
            {duplicate.duplicateChecks.Exact && (
                <Box ml={1}>
                    <Chip size="small" label={l10n.exactDuplicate} color="secondary" />
                </Box>
            )}
        </ListItem>
    );
};
