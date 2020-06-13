import { Box, Chip, ListItem, ListItemText, Tooltip, Typography } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import { DoubleTypes, IFileDuplicate } from "../../../common/types";
import { useL10n } from "../../utils/l10n-hooks";
import { getShowFileHandler, usePathStyles } from "./tools";

interface IProps {
    duplicate: IFileDuplicate;
}

export const DuplicateEntry = ({ duplicate }: IProps) => {
    const [l10n] = useL10n();
    const classes = usePathStyles();

    const chipMap = {
        [DoubleTypes.Exact]: {
            tooltip: l10n.exactDescription,
            title: l10n.exact,
        },
        [DoubleTypes.Catalog]: {
            tooltip: l10n.catalogDescription,
            title: l10n.catalog,
        },
        [DoubleTypes.Skintone]: {
            tooltip: l10n.skintoneDescription,
            title: l10n.skintone,
        },
        [DoubleTypes.Cas]: {
            tooltip: l10n.casDescription,
            title: l10n.cas,
        },
        [DoubleTypes.Slider]: {
            tooltip: l10n.sliderDescription,
            title: l10n.slider,
        },
    };

    return (
        <ListItem button={true} onClick={getShowFileHandler(duplicate.path)}>
            <ListItemText className={classes.base} primary={duplicate.basename} secondary={l10n.date(duplicate.date)} />

            <Tooltip title={duplicate.path}>
                <Typography color="textSecondary" className={classes.path}>
                    {duplicate.path}
                </Typography>
            </Tooltip>
            {_.map(duplicate.duplicateChecks, (isTrue, type: DoubleTypes) => {
                if (!isTrue) {
                    return null;
                }

                return (
                    <Tooltip key={type} title={chipMap[type].tooltip}>
                        <Box ml={1}>
                            <Chip size="small" label={chipMap[type].title} color="secondary" />
                        </Box>
                    </Tooltip>
                );
            })}
        </ListItem>
    );
};
