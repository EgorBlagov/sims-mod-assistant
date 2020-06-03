import { Box, Chip, ListItem, ListItemText, Tooltip } from "@material-ui/core";
import { shell } from "electron";
import * as React from "react";
import { IFileDuplicate } from "../../../common/types";
import { useL10n } from "../../utils/L10n";

interface IProps {
    duplicate: IFileDuplicate;
}

export const DuplicateEntry = ({ duplicate }: IProps) => {
    const [l10n, __] = useL10n();

    const getShowFileHandler = (path: string) => () => shell.showItemInFolder(path);

    return (
        <ListItem button={true} onClick={getShowFileHandler(duplicate.path)}>
            <Tooltip title={duplicate.path}>
                <ListItemText primary={duplicate.basename} secondary={l10n.date(duplicate.date)} />
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
