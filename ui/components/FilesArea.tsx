import { Box, Chip, Divider, List, ListItemText, makeStyles } from "@material-ui/core";
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

const DuplicateEntry = ({ duplicate }: { duplicate: IFileDuplicate }) => {
    const [l10n, __] = useL10n();
    return (
        <>
            <ListItemText primary={duplicate.basename} secondary={l10n.date(duplicate.date)} />
            <Box display="flex">
                {duplicate.duplicateChecks.Catalogue && (
                    <Box ml={1}>
                        <Chip label={l10n.catalogueDuplicate} color="primary" />
                    </Box>
                )}
                {duplicate.duplicateChecks.Exact && (
                    <Box ml={1}>
                        <Chip label={l10n.exactDuplicate} color="secondary" />
                    </Box>
                )}
            </Box>
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
                    <ListItemText primary={x.original.basename} secondary={l10n.date(x.original.date)} />
                    <List disablePadding={true} className={classes.nested}>
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
