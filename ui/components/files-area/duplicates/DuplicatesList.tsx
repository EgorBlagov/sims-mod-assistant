import { Box, Checkbox, Divider, List, ListItem, ListItemText, makeStyles, Tooltip } from "@material-ui/core";
import _ from "lodash";
import path from "path";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { isOk } from "../../../../common/tools";
import { IDuplicateGraph, ISearchResult } from "../../../../common/types";
import { ConflictResolverActions } from "../../../redux/conflict-resolver/action-creators";
import { TState } from "../../../redux/reducers";
import { ConflictResolverThunk } from "../../../redux/thunk/conflict-resolver";
import { getCheckboxState } from "../../../utils/checkbox";
import { pathFilter } from "../../../utils/filter";
import { useL10n } from "../../../utils/l10n-hooks";
import { useThunkDispatch } from "../../../utils/thunk-hooks";
import { usePathStyles } from "../tools";
import { DetailedDialog } from "./detailed/DetailedDialog";
import { DuplicateGroupToolbar } from "./DuplicateGroupToolbar";
import { DuplicateMainToolbar } from "./DuplicateMainToolbar";
import { DuplicateToolbar } from "./DuplicateToolbar";

interface IProps {
    searchInfo: ISearchResult;
}

const useStyles = makeStyles({
    scrollY: {
        overflowY: "auto",
    },
});

export const DuplicatesList = ({ searchInfo }: IProps) => {
    const dispatch = useThunkDispatch();
    const [l10n] = useL10n();
    const [detailedVisible, setDetailedVisible] = useState<boolean>(false);
    const [graph, setGraph] = useState<IDuplicateGraph>(undefined);
    const { filesFilter, selectedConflictFiles: checkedItems } = useSelector((state: TState) => state.conflictResolver);
    const pathClasses = usePathStyles();
    const classes = useStyles();

    const getCheckboxHandler = (filePath: string) => (__, checked: boolean) => {
        dispatch(ConflictResolverActions.selectFiles([path.basename(filePath)], checked));
    };

    const getGroupCheckboxHandler = (groupIndex: number) => (__, checked: boolean) => {
        dispatch(ConflictResolverThunk.selectGroup(groupIndex, checked));
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
            <DuplicateMainToolbar />
            <Box flex="auto" className={classes.scrollY}>
                <List>
                    {_.map(searchInfo.duplicates, (x, i) => {
                        const groupCheckbox = getCheckboxState(
                            x.detailed.nodes.length,
                            x.detailed.nodes.filter((n) => checkedItems[n.path]).length,
                        );

                        const currentPaths = x.detailed.nodes.map((n) => n.path).filter(pathFilter(filesFilter));
                        if (currentPaths.length === 0) {
                            return null;
                        }

                        return (
                            <React.Fragment key={i}>
                                <DuplicateGroupToolbar
                                    group={x}
                                    groupChecked={groupCheckbox}
                                    onChange={getGroupCheckboxHandler(i)}
                                    openDetailed={openDetailedDialog}
                                />
                                {_.map(currentPaths, (filePath) => (
                                    <ListItem key={filePath}>
                                        <Checkbox
                                            color="primary"
                                            checked={Object.keys(checkedItems).length > 0 && checkedItems[filePath]}
                                            onChange={getCheckboxHandler(filePath)}
                                        />
                                        <Tooltip title={filePath}>
                                            <ListItemText
                                                className={pathClasses.base}
                                                primary={path.basename(filePath)}
                                                secondary={l10n.date(searchInfo.fileInfos[filePath].modifiedDate)}
                                            />
                                        </Tooltip>
                                        <Box flexGrow={1}>
                                            <DuplicateToolbar path={filePath} />
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
