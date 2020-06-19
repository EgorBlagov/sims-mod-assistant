import { Box, Divider, List, ListItem, ListItemText, makeStyles, Tooltip } from "@material-ui/core";
import _ from "lodash";
import path from "path";
import * as React from "react";
import { isOk } from "../../../common/tools";
import { ISearchResult } from "../../../common/types";
import { useL10n } from "../../utils/l10n-hooks";
import { DuplicateToolbar } from "./DuplicateToolbar";
import { GroupToolbar } from "./GroupToolbar";
import { usePathStyles } from "./tools";

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
                        <ListItem key={node.path}>
                            <Tooltip title={node.path}>
                                <ListItemText
                                    className={pathClasses.base}
                                    primary={path.basename(node.path)}
                                    secondary={l10n.date(searchInfo.fileInfos[node.path].modifiedDate)}
                                />
                            </Tooltip>
                            <Box flexGrow={1}>
                                <DuplicateToolbar path={node.path} />
                            </Box>
                        </ListItem>
                    ))}

                    <Divider component="li" />
                </React.Fragment>
            ))}
        </List>
    );
};
