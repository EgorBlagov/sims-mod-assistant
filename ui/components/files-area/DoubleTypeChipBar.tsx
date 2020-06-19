import { Box, Chip, Tooltip } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { DoubleTypes } from "../../../common/types";
import { useL10n } from "../../utils/l10n-hooks";

interface IProps {
    types: DoubleTypes[];
}

export const DoubleTypeChipBar = ({ types }: IProps) => {
    const [l10n] = useL10n();

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
        <>
            {_.map(types, (type: DoubleTypes) => (
                <Tooltip key={type} title={chipMap[type].tooltip}>
                    <Box mr={1}>
                        <Chip size="small" label={chipMap[type].title} color="secondary" />
                    </Box>
                </Tooltip>
            ))}
        </>
    );
};
