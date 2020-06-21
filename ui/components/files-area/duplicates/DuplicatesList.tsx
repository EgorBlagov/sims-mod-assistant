import { Box, Checkbox, Divider, List, ListItem, ListItemText, makeStyles, Tooltip } from "@material-ui/core";
import _ from "lodash";
import path from "path";
import React, { useEffect, useState } from "react";
import { isOk } from "../../../../common/tools";
import { IDuplicateGraph, ISearchResult } from "../../../../common/types";
import { useL10n } from "../../../utils/l10n-hooks";
import { usePathStyles } from "../tools";
import { DetailedDialog } from "./detailed/DetailedDialog";
import { DuplicateGroupToolbar, GroupCheckboxState } from "./DuplicateGroupToolbar";
import { DuplicateMainToolbar } from "./DuplicateMainToolbar";
import { DuplicateToolbar } from "./DuplicateToolbar";

interface IProps {
    searchInfo: ISearchResult;
}

interface ICheckedInfo {
    [path: string]: boolean;
}
const useStyles = makeStyles({
    scrollY: {
        overflowY: "auto",
    },
});

export const DuplicatesList = ({ searchInfo }: IProps) => {
    const [l10n] = useL10n();
    const pathClasses = usePathStyles();
    const classes = useStyles();
    const [detailedVisible, setDetailedVisible] = useState<boolean>(false);
    const [graph, setGraph] = useState<IDuplicateGraph>(undefined);
    const [checkedItems, setCheckedItems] = useState<ICheckedInfo>({});

    useEffect(() => {
        if (isOk(searchInfo)) {
            const newCheckedItems = {};
            for (const group of searchInfo.duplicates) {
                for (const node of group.detailed.nodes) {
                    newCheckedItems[node.path] = node.path in checkedItems ? checkedItems[node.path] : false;
                }
            }

            setCheckedItems(newCheckedItems);
        } else {
            setCheckedItems({});
        }
    }, [searchInfo]);

    const getCheckboxHandler = (filePath: string) => (__, checked: boolean) => {
        setCheckedItems({ ...checkedItems, [filePath]: checked });
    };

    const getGroupCheckboxHandler = (groupIndex: number) => (__, checked: boolean) => {
        const newCheckedItems = { ...checkedItems };

        for (const node of searchInfo.duplicates[groupIndex].detailed.nodes) {
            newCheckedItems[node.path] = checked;
        }

        setCheckedItems(newCheckedItems);
    };

    const setAllChecked = (checked: boolean) => {
        setCheckedItems(_.mapValues(checkedItems, () => checked));
    };

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
        <Box display="flex" flexDirection="column" height="100%">
            <DuplicateMainToolbar selectedPaths={Object.entries(checkedItems).filter(([__, checked]) => checked).map(([p]) => p)} setChecked={setAllChecked} />
            <Box flex="auto" className={classes.scrollY}>
                <List>
                    {_.map(searchInfo.duplicates, (x, i) => {
                        let groupState: GroupCheckboxState = GroupCheckboxState.Unchecked;
                        if (Object.keys(checkedItems).length > 0) {
                            groupState = _.every(searchInfo.duplicates[i].detailed.nodes, (n) => checkedItems[n.path])
                                ? GroupCheckboxState.Checked
                                : _.some(searchInfo.duplicates[i].detailed.nodes, (n) => checkedItems[n.path])
                                ? GroupCheckboxState.Indeterminate
                                : GroupCheckboxState.Unchecked;
                        }

                        return (
                            <React.Fragment key={i}>
                                <DuplicateGroupToolbar
                                    group={x}
                                    groupChecked={groupState}
                                    onChange={getGroupCheckboxHandler(i)}
                                    openDetailed={openDetailedDialog}
                                />
                                {_.map(x.detailed.nodes, (node) => (
                                    <ListItem key={node.path}>
                                        <Checkbox
                                            color="primary"
                                            checked={Object.keys(checkedItems).length > 0 && checkedItems[node.path]}
                                            onChange={getCheckboxHandler(node.path)}
                                        />
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
                        );
                    })}
                </List>
            </Box>
            <DetailedDialog visible={detailedVisible} close={closeDetailedDialog} graph={graph} />
        </Box>
    );
};
