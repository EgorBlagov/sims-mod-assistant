import { Avatar, Box, Chip, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from "@material-ui/core";
import Error from "@material-ui/icons/Error";
import * as React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { isOk } from "../../../common/tools";
import { ISearchResult, SkipReasons } from "../../../common/types";
import { useL10n } from "../../utils/l10n-hooks";
import { getShowFileHandler } from "./tools";
interface IProps {
    searchInfo: ISearchResult;
}

type TChipMap = {
    [K in SkipReasons]: {
        label: string;
        tooltip: string;
    };
};

const VIRTUALIZE_CONSTANTS = {
    ITEM_HEIGHT: 72,
    PLACEHOLDER_PADDING_LEFT: 72,
    PLACEHOLDER_PADDING_TOP: 14,
};

export const SkipsList = ({ searchInfo }: IProps) => {
    const [l10n] = useL10n();

    if (!isOk(searchInfo)) {
        return null;
    }

    const chipMap: TChipMap = {
        [SkipReasons.UnsupportedSimsVersion]: {
            label: l10n.unsupportedSimsVersion,
            tooltip: l10n.unsupportedSimsVersionTooltip,
        },
        [SkipReasons.NotPackage]: {
            label: l10n.notPackage,
            tooltip: l10n.notPackageDescription,
        },

        [SkipReasons.UnableToParse]: {
            label: l10n.unableToParse,
            tooltip: l10n.unableToParseDescription,
        },
    };

    const Row = ({ index, style, isScrolling }) => {
        const x = searchInfo.skips[index];

        const content = isScrolling ? (
            <Typography
                style={{
                    paddingTop: VIRTUALIZE_CONSTANTS.PLACEHOLDER_PADDING_TOP,
                    paddingLeft: VIRTUALIZE_CONSTANTS.PLACEHOLDER_PADDING_LEFT,
                }}
            >
                {x.basename}
            </Typography>
        ) : (
            <ListItem key={x.path} button={true} onClick={getShowFileHandler(x.path)}>
                <ListItemIcon>
                    <Avatar>
                        <Error />
                    </Avatar>
                </ListItemIcon>
                <Tooltip title={x.path}>
                    <ListItemText primary={x.basename} secondary={l10n.date(x.date)} />
                </Tooltip>

                <Tooltip title={chipMap[x.reason].tooltip}>
                    <Box ml={1}>
                        <Chip label={chipMap[x.reason].label} color="secondary" />
                    </Box>
                </Tooltip>
            </ListItem>
        );
        return <div style={style}>{content}</div>;
    };

    return (
        <AutoSizer>
            {({ height, width }) => (
                <FixedSizeList
                    height={height}
                    width={width}
                    itemCount={searchInfo.skips.length}
                    itemSize={VIRTUALIZE_CONSTANTS.ITEM_HEIGHT}
                    useIsScrolling={true}
                >
                    {Row as any}
                </FixedSizeList>
            )}
        </AutoSizer>
    );
};
