import { Box, Divider, List, ListItem, ListItemText, Tooltip } from "@material-ui/core";
import _ from "lodash";
import path from "path";
import React, { useState } from "react";
import { isOk } from "../../../../common/tools";
import { IDuplicateGraph, ISearchResult } from "../../../../common/types";
import { useL10n } from "../../../utils/l10n-hooks";
import { usePathStyles } from "../tools";
import { DetailedDialog } from "./detailed/DetailedDialog";
import { DuplicateGroupToolbar } from "./DuplicateGroupToolbar";
import { DuplicateToolbar } from "./DuplicateToolbar";

interface IProps {
    searchInfo: ISearchResult;
}

export const DuplicatesList = ({ searchInfo }: IProps) => {
    const [l10n] = useL10n();
    const pathClasses = usePathStyles();
    const [detailedVisible, setDetailedVisible] = useState<boolean>(false);
    const [graph, setGraph] = useState<IDuplicateGraph>(undefined);

    const closeDetailedDialog = () => {
        setDetailedVisible(false);
        setGraph(undefined);
    };

    const openDetailedDialog = (newGraph: IDuplicateGraph) => {
        setGraph(newGraph);
        setDetailedVisible(true);
    };

    if (!isOk(searchInfo)) {
        return null;
    }

    return (
        <>
            <List>
                {_.map(searchInfo.duplicates, (x, i) => (
                    <React.Fragment key={i}>
                        <DuplicateGroupToolbar group={x} openDetailed={openDetailedDialog} />
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
            <DetailedDialog visible={detailedVisible} close={closeDetailedDialog} graph={graph} />
        </>
    );
};
