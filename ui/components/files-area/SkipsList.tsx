import { Avatar, Box, Chip, List, ListItem, ListItemIcon, ListItemText, Tooltip } from "@material-ui/core";
import Error from "@material-ui/icons/Error";
import * as _ from "lodash";
import * as React from "react";
import { isOk } from "../../../common/tools";
import { ISearchResult, SkipReasons } from "../../../common/types";
import { useL10n } from "../../utils/L10n";
import { getShowFileHandler } from "./tools";

interface IProps {
    searchInfo: ISearchResult;
}

export const SkipsList = ({ searchInfo }: IProps) => {
    const [l10n, __] = useL10n();

    if (!isOk(searchInfo)) {
        return null;
    }

    const chipMap = {
        [SkipReasons.UnsupportedIndexType]: {
            label: l10n.unsupportedIndexType,
            tooltip: l10n.unsupportedIndexTypeTooltip,
        },
        [SkipReasons.UnsupportedSimsVersion]: {
            label: l10n.unsupportedSimsVersion,
            tooltip: l10n.unsupportedSimsVersionTooltip,
        },
    };

    return (
        <List>
            {_.map(searchInfo.skips, (x) => (
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
            ))}
        </List>
    );
};
