import { Box, Checkbox, Divider, List, ListItem, ListItemText, Tooltip } from "@material-ui/core";
import _ from "lodash";
import path from "path";
import React, { useEffect, useState } from "react";
import { isOk } from "../../../../common/tools";
import { IDuplicateGraph, ISearchResult } from "../../../../common/types";
import { useL10n } from "../../../utils/l10n-hooks";
import { usePathStyles } from "../tools";
import { DetailedDialog } from "./detailed/DetailedDialog";
import { DuplicateGroupToolbar, GroupCheckboxState } from "./DuplicateGroupToolbar";
import { DuplicateToolbar } from "./DuplicateToolbar";

interface IProps {
    searchInfo: ISearchResult;
}

interface IGroupCheckedInfo {
    [path: string]: boolean;
}

export const DuplicatesList = ({ searchInfo }: IProps) => {
    const [l10n] = useL10n();
    const pathClasses = usePathStyles();
    const [detailedVisible, setDetailedVisible] = useState<boolean>(false);
    const [graph, setGraph] = useState<IDuplicateGraph>(undefined);
    const [checkedItems, setCheckedItems] = useState<IGroupCheckedInfo[]>([]);

    useEffect(() => {
        if (isOk(searchInfo)) {
            const newCheckedInfo: IGroupCheckedInfo[] = [];
            for (const group of searchInfo.duplicates) {
                const groupInfo: IGroupCheckedInfo = {};
                for (const node of group.detailed.nodes) {
                    groupInfo[node.path] = false;
                }
                newCheckedInfo.push(groupInfo);
            }

            setCheckedItems(newCheckedInfo);
        }
    }, [searchInfo]);

    const setCheckedItem = (groupIndex: number, filePath: string, checked: boolean) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[groupIndex] = { ...checkedItems[groupIndex], [filePath]: checked };

        setCheckedItems(newCheckedItems);
    };

    const getCheckboxHandler = (groupIndex: number, filePath: string) => (__, checked: boolean) => {
        setCheckedItem(groupIndex, filePath, checked);
    };

    const getGroupCheckboxHandler = (groupIndex: number) => (__, checked: boolean) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[groupIndex] = _.mapValues(checkedItems[groupIndex], () => checked);
        setCheckedItems(newCheckedItems);
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
        <>
            <List>
                {_.map(searchInfo.duplicates, (x, i) => {
                    let groupState: GroupCheckboxState = GroupCheckboxState.Unchecked;
                    if (checkedItems.length > 0) {
                        groupState = _.every(checkedItems[i], (v) => v)
                            ? GroupCheckboxState.Checked
                            : _.some(checkedItems[i], (v) => v)
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
                                        checked={checkedItems.length !== 0 && checkedItems[i][node.path]}
                                        onChange={getCheckboxHandler(i, node.path)}
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
            <DetailedDialog visible={detailedVisible} close={closeDetailedDialog} graph={graph} />
        </>
    );
};
