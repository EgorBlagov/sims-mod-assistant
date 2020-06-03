import { Box, Chip, Divider, List, ListItem, ListItemText, makeStyles, Tooltip } from "@material-ui/core";
import { shell } from "electron";
import * as _ from "lodash";
import * as React from "react";
import { isOk } from "../../common/tools";
import { IFileDuplicate, ISearchResult } from "../../common/types";
import { useL10n } from "../utils/L10n";

interface IProps {
    searchInfo: ISearchResult;
}

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
        paddingBottom: theme.spacing(1),
    },
}));

const getShowFileHandler = (path: string) => () => shell.showItemInFolder(path);

const DuplicateEntry = ({ duplicate }: { duplicate: IFileDuplicate }) => {
    const [l10n, __] = useL10n();
    return (
        <>
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
        </>
    );
};

export const FilesArea = ({ searchInfo }: IProps) => {
    const [l10n, __] = useL10n();
    const classes = useStyles();

    if (!isOk(searchInfo)) {
        return null;
    }

    return (
        <List>
            {_.map(searchInfo.entries, (x) => (
                <React.Fragment key={x.original.path}>
                    <ListItem button={true} onClick={getShowFileHandler(x.original.path)}>
                        <Tooltip title={x.original.path}>
                            <ListItemText primary={x.original.basename} secondary={l10n.date(x.original.date)} />
                        </Tooltip>
                    </ListItem>
                    <List disablePadding={true} className={classes.nested} dense={true}>
                        {_.map(x.duplicates, (duplicate, j) => (
                            <DuplicateEntry key={duplicate.path} duplicate={duplicate} />
                        ))}
                    </List>
                    <Divider component="li" />
                </React.Fragment>
            ))}
        </List>
    );
};
