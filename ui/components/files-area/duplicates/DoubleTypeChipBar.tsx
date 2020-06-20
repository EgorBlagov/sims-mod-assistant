import { Box, Chip, Tooltip } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { DoubleTypes } from "../../../../common/types";
import { useL10n } from "../../../utils/l10n-hooks";
import { doubleTypeMap } from "../../../utils/language-mapping";

interface IProps {
    types: DoubleTypes[];
}

export const DoubleTypeChipBar = ({ types }: IProps) => {
    const [l10n] = useL10n();

    return (
        <>
            {_.map(types, (type: DoubleTypes) => (
                <Tooltip key={type} title={doubleTypeMap[type](l10n).tooltip}>
                    <Box mr={1}>
                        <Chip size="small" label={doubleTypeMap[type](l10n).title} color="secondary" />
                    </Box>
                </Tooltip>
            ))}
        </>
    );
};
