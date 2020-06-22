import { Box, Checkbox, Divider, List, ListItem, ListItemText, makeStyles, Tooltip } from "@material-ui/core";
import _ from "lodash";
import path from "path";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isOk } from "../../../../common/tools";
import { IDuplicateGraph, ISearchResult } from "../../../../common/types";
import { ConflictResolverActions } from "../../../redux/conflict-resolver/action-creators";
import { TState } from "../../../redux/reducers";
import { useL10n } from "../../../utils/l10n-hooks";
import { isValidRegex } from "../../../utils/regex";
import { usePathStyles } from "../tools";
import { DetailedDialog } from "./detailed/DetailedDialog";
import { DuplicateGroupToolbar, GroupCheckboxState } from "./DuplicateGroupToolbar";
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
    const [l10n] = useL10n();
    const dispatch = useDispatch();
    const pathClasses = usePathStyles();
    const classes = useStyles();
    const [detailedVisible, setDetailedVisible] = useState<boolean>(false);
    const [graph, setGraph] = useState<IDuplicateGraph>(undefined);
    const [filter, setFilter] = useState<string>("");

    const filterValid = isOk(filter) && filter.length !== 0 && isValidRegex(filter);

    const filterPaths = (paths: string[]): string[] => {
        if (filterValid) {
            const regex = new RegExp(filter);
            return paths.filter((p) => path.basename(p).search(regex) !== -1);
        }

        return paths;
    };

    const getCheckboxHandler = (filePath: string) => (__, checked: boolean) => {
        dispatch(ConflictResolverActions.selectFiles([filePath], checked));
    };

    const getGroupCheckboxHandler = (groupIndex: number) => (__, checked: boolean) => {
        const paths = filterPaths(searchInfo.duplicates[groupIndex].detailed.nodes.map((n) => n.path));
        dispatch(ConflictResolverActions.selectFiles(paths, checked));
    };

    const setAllChecked = (checked: boolean) => {
        const allPaths = searchInfo.duplicates.reduce(
            (prev, g) => prev.concat(g.detailed.nodes.map((n) => n.path)),
            [] as string[],
        );

        const paths = filterPaths(allPaths);
        dispatch(ConflictResolverActions.selectFiles(paths, checked));
    };

    const checkedItems = useSelector((state: TState) => state.conflictResolver.selectedConflictFiles);

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
            <DuplicateMainToolbar
                selectedPaths={Object.entries(checkedItems)
                    .filter(([__, checked]) => checked)
                    .map(([p]) => p)}
                setChecked={setAllChecked}
                filter={filter}
                setFilter={setFilter}
            />
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

                        const currentPaths = filterPaths(x.detailed.nodes.map((n) => n.path));
                        if (currentPaths.length === 0) {
                            return null;
                        }

                        return (
                            <React.Fragment key={i}>
                                <DuplicateGroupToolbar
                                    group={x}
                                    groupChecked={groupState}
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
