import { Box, IconButton, ListItem, Tooltip } from "@material-ui/core";
import React from "react";
import { IDuplicateGraph, IDuplicateGroup } from "../../../../common/types";
import { useL10n } from "../../../utils/l10n-hooks";
import { GraphIcon } from "../../icons/GraphIcon";
import { DoubleTypeChipBar } from "./DoubleTypeChipBar";

interface IProps {
    group: IDuplicateGroup;
    openDetailed: (group: IDuplicateGraph) => void;
}

export const DuplicateGroupToolbar = ({ group, openDetailed }: IProps) => {
    const [l10n] = useL10n();
    const onClick = () => openDetailed(group.detailed);
    return (
        <ListItem>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <DoubleTypeChipBar types={group.types} />
                <Tooltip title={l10n.detailed} placement="top">
                    <IconButton onClick={onClick} size="small" color="primary">
                        <GraphIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </ListItem>
    );
};
