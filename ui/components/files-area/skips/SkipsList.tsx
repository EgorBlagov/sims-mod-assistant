import React, { useReducer } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { isOk } from "../../../../common/tools";
import { ISearchResult } from "../../../../common/types";
import { VIRTUALIZE_CONSTANTS } from "../../../utils/constants";
import { useL10n } from "../../../utils/l10n-hooks";
import { IItemData, SkipRow } from "./SkipRow";

interface IProps {
    searchInfo: ISearchResult;
}

export const SkipsList = ({ searchInfo }: IProps) => {
    const [l10n, language] = useL10n();

    if (!isOk(searchInfo)) {
        return null;
    }

    // hask to force update on language change, since
    // react-window doesn't rerender items whenver it's possible
    const [key, increaseKey] = useReducer((state) => state + 1, 0);
    React.useEffect(() => {
        increaseKey();
    }, [language]);

    const itemData: IItemData = {
        skips: searchInfo.skips,
        fileInfos: searchInfo.fileInfos,
        l10n,
    };

    return (
        <AutoSizer key={key}>
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
