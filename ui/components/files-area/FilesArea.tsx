import { Avatar, Divider, List, ListItem, ListItemIcon, ListItemText, makeStyles, Tooltip } from "@material-ui/core";
import { shell } from "electron";
import * as _ from "lodash";
import * as React from "react";
import { isOk } from "../../../common/tools";
import { ISearchResult } from "../../../common/types";
import { useL10n } from "../../utils/L10n";
import { SimsIcon } from "../icons/SimsIcon";
import { DuplicateEntry } from "./DuplicateEntry";

interface IProps {
    searchInfo: ISearchResult;
}

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
        paddingBottom: theme.spacing(1),
    },
}));

export const FilesArea = ({ searchInfo }: IProps) => {
    const [l10n, __] = useL10n();
    const classes = useStyles();
    const getShowFileHandler = (path: string) => () => shell.showItemInFolder(path);

    if (!isOk(searchInfo)) {
        return null;
    }

    return (
        <List>
            {_.map(searchInfo.entries, (x) => (
                <React.Fragment key={x.original.path}>
                    <ListItem button={true} onClick={getShowFileHandler(x.original.path)}>
                        <ListItemIcon>
                            <Avatar>
                                <SimsIcon />
                            </Avatar>
                        </ListItemIcon>
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
