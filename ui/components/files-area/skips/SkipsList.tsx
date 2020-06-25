import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { isOk } from "../../../../common/tools";
import { ISearchResult } from "../../../../common/types";
import { VIRTUALIZE_CONSTANTS } from "../../../utils/constants";
import { useL10n } from "../../../utils/l10n-hooks";
import { useForceUpdate } from "../../../utils/util-hooks";
import { IItemData, SkipRow } from "./SkipRow";

interface IProps {
    searchInfo: ISearchResult;
}

export const SkipsList = ({ searchInfo }: IProps) => {
    const [l10n, language] = useL10n();

    if (!isOk(searchInfo)) {
        return null;
    }

    const forceUpdateKey = useForceUpdate([language]);

    const itemData: IItemData = {
        skips: searchInfo.skips,
        fileInfos: searchInfo.fileInfos,
        l10n,
    };

    return (
        <AutoSizer key={forceUpdateKey}>
            {({ height, width }) => (
                <FixedSizeList
                    height={height}
                    width={width}
                    itemCount={searchInfo.skips.length}
                    itemData={itemData}
                    itemSize={VIRTUALIZE_CONSTANTS.SKIP_ITEM_HEIGHT}
                    useIsScrolling={true}
                >
                    {SkipRow}
                </FixedSizeList>
            )}
        </AutoSizer>
    );
};
