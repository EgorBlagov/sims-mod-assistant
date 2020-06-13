import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Tooltip,
    Typography,
} from "@material-ui/core";
import * as _ from "lodash";
import * as React from "react";
import { isOk } from "../../../common/tools";
import { ISearchResult } from "../../../common/types";
import { useL10n } from "../../utils/l10n-hooks";
import { SimsIcon } from "../icons/SimsIcon";
import { DuplicateEntry } from "./DuplicateEntry";
import { getShowFileHandler, usePathStyles } from "./tools";

interface IProps {
    searchInfo: ISearchResult;
}

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
        paddingBottom: theme.spacing(1),
    },
}));

export const DuplicatesList = ({ searchInfo }: IProps) => {
    const [l10n] = useL10n();
    const classes = useStyles();
    const pathClasses = usePathStyles();

    if (!isOk(searchInfo)) {
        return null;
    }

    return (
        <List>
            {_.map(searchInfo.duplicates, (x) => (
                <React.Fragment key={x.original.path}>
                    <ListItem button={true} onClick={getShowFileHandler(x.original.path)}>
                        <ListItemIcon>
                            <Avatar>
                                <SimsIcon />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText
                            className={pathClasses.base}
                            primary={x.original.basename}
                            secondary={l10n.date(x.original.date)}
                        />

                        <Tooltip title={x.original.path}>
                            <Typography color="textSecondary" className={pathClasses.path}>
                                {x.original.path}
                            </Typography>
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
