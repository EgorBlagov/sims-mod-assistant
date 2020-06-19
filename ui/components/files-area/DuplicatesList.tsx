import { Divider, List, ListItem, ListItemText, makeStyles, Tooltip, Typography } from "@material-ui/core";
import _ from "lodash";
import path from "path";
import * as React from "react";
import { isOk } from "../../../common/tools";
import { ISearchResult } from "../../../common/types";
import { useL10n } from "../../utils/l10n-hooks";
import { GroupToolbar } from "./GroupToolbar";
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
            {_.map(searchInfo.duplicates, (x, i) => (
                <React.Fragment key={i}>
                    <GroupToolbar group={x} />
                    {_.map(x.detailed.nodes, (node) => (
                        <ListItem key={node.path} button={true} onClick={getShowFileHandler(node.path)}>
                            <ListItemText
                                className={pathClasses.base}
                                primary={path.basename(node.path)}
                                secondary={l10n.date(searchInfo.fileInfos[node.path].modifiedDate)}
                            />

                            <Tooltip title={node.path}>
                                <Typography color="textSecondary" className={pathClasses.path}>
                                    {node.path}
                                </Typography>
                            </Tooltip>
                        </ListItem>
                    ))}

                    <Divider component="li" />
                </React.Fragment>
            ))}
        </List>
    );
};
