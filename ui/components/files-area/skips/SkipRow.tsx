import { Avatar, Box, Chip, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from "@material-ui/core";
import Error from "@material-ui/icons/Error";
import path from "path";
import React from "react";
import { Translation } from "../../../../common/l10n";
import { IFileAdditionalInfo, ISkippedFile, SkipReasons } from "../../../../common/types";
import { VIRTUALIZE_CONSTANTS } from "../../../utils/constants";
import { getShowFileHandler } from "../tools";

export interface IItemData {
    skips: ISkippedFile[];
    fileInfos: Record<string, IFileAdditionalInfo>;
    l10n: Translation;
}

interface IProps {
    index: number;
    style: object;
    isScrolling?: boolean;
    data: IItemData;
}

type TChipMap = {
    [K in SkipReasons]: {
        label: string;
        tooltip: string;
    };
};

export const SkipRow = ({ index, style, isScrolling, data }: IProps) => {
    const x = data.skips[index];
    const { l10n } = data;

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

    const [content, setContent] = React.useState(
        <Typography
            style={{
                paddingTop: VIRTUALIZE_CONSTANTS.PLACEHOLDER_PADDING_TOP,
                paddingLeft: VIRTUALIZE_CONSTANTS.PLACEHOLDER_PADDING_LEFT,
            }}
        >
            {path.basename(x.path)}
        </Typography>,
    );

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setContent(
                <ListItem key={x.path} button={true} onClick={getShowFileHandler(x.path)}>
                    <ListItemIcon>
                        <Avatar>
                            <Error />
                        </Avatar>
                    </ListItemIcon>
                    <Tooltip title={x.path}>
                        <ListItemText
                            primary={path.basename(x.path)}
                            secondary={l10n.date(data.fileInfos[x.path].modifiedDate)}
                        />
                    </Tooltip>

                    <Tooltip title={chipMap[x.reason].tooltip}>
                        <Box ml={1}>
                            <Chip label={chipMap[x.reason].label} color="secondary" />
                        </Box>
                    </Tooltip>
                </ListItem>,
            );
        });

        return () => clearTimeout(timer);
    }, []);

    return <div style={style}>{content}</div>;
};
