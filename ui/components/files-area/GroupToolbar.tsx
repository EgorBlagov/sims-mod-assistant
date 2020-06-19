import { Box, IconButton, ListItem, Tooltip } from "@material-ui/core";
import React from "react";
import { IDuplicateGroup } from "../../../common/types";
import { useL10n } from "../../utils/l10n-hooks";
import { GraphIcon } from "../icons/GraphIcon";
import { DoubleTypeChipBar } from "./DoubleTypeChipBar";

interface IProps {
    group: IDuplicateGroup;
}

export const GroupToolbar = ({ group }: IProps) => {
    const [l10n] = useL10n();
    const notImplementedClick = () => alert("Not implemented");
    return (
        <ListItem>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <DoubleTypeChipBar types={group.types} />
                <Tooltip title={l10n.detailed} placement="top">
                    <IconButton onClick={notImplementedClick} size="small" color="primary">
                        <GraphIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </ListItem>
    );
};
