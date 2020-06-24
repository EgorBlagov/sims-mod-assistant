import { Box, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { isOk } from "../../../../common/tools";
import { IDuplicateGraph, ISearchResult } from "../../../../common/types";
import { ConflictResolverActions } from "../../../redux/conflict-resolver/action-creators";
import { TState } from "../../../redux/reducers";
import { getCheckboxState } from "../../../utils/checkbox";
import { VIRTUALIZE_CONSTANTS } from "../../../utils/constants";
import { pathFilter } from "../../../utils/filter";
import { useThunkDispatch } from "../../../utils/thunk-hooks";
import { DetailedDialog } from "./detailed/DetailedDialog";
import { DuplicateMainToolbar } from "./DuplicateMainToolbar";
import { DuplicateRow, DuplicateRowType, TItemData } from "./DuplicateRow";

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
    const [detailedVisible, setDetailedVisible] = useState<boolean>(false);
    const [graph, setGraph] = useState<IDuplicateGraph>(undefined);
    const { filesFilter, selectedConflictFiles: checkedItems } = useSelector((state: TState) => state.conflictResolver);
    const classes = useStyles();

    const getCheckboxHandler = (files: string[]) => (checked: boolean) => {
        dispatch(ConflictResolverActions.selectFiles(files, checked));
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

    const key = 1; // hack to update on language change
    const data: TItemData = [];

    for (const group of searchInfo.duplicates) {
        const currentPaths = group.detailed.nodes.map((n) => n.path).filter(pathFilter(filesFilter));
        if (currentPaths.length === 0) {
            continue;
        }

        data.push({
            type: DuplicateRowType.Toolbar,
            group,
            groupChecked: getCheckboxState(currentPaths.length, currentPaths.filter((p) => checkedItems[p]).length),
            onChange: getCheckboxHandler(currentPaths),
            openDetailed: openDetailedDialog,
        });

        for (const path of currentPaths) {
            data.push({
                type: DuplicateRowType.Entry,
                checked: checkedItems[path],
                filePath: path,
                modifiedDate: searchInfo.fileInfos[path].modifiedDate,
                onChange: getCheckboxHandler([path]),
            });
        }
    }

    return (
        <Box display="flex" flexDirection="column" height="100%">
            <DuplicateMainToolbar />
            <Box flex="auto" className={classes.scrollY}>
                <AutoSizer key={key}>
                    {({ height, width }) => (
                        <FixedSizeList
                            height={height}
                            width={width}
                            itemCount={data.length}
                            itemData={data}
                            itemSize={VIRTUALIZE_CONSTANTS.SKIP_ITEM_HEIGHT}
                            useIsScrolling={true}
                        >
                            {DuplicateRow}
                        </FixedSizeList>
                    )}
                </AutoSizer>
            </Box>
            <DetailedDialog visible={detailedVisible} close={closeDetailedDialog} graph={graph} />
        </Box>
    );
};
