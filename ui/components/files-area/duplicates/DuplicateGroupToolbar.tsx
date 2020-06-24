import { Box, Checkbox, IconButton, ListItem, Tooltip } from "@material-ui/core";
import React from "react";
import { IDuplicateGraph, IDuplicateGroup } from "../../../../common/types";
import { CheckboxState } from "../../../utils/checkbox";
import { useL10n } from "../../../utils/l10n-hooks";
import { GraphIcon } from "../../icons/GraphIcon";
import { DoubleTypeChipBar } from "./DoubleTypeChipBar";

interface IProps {
    group: IDuplicateGroup;
    openDetailed: (group: IDuplicateGraph) => void;
    groupChecked: CheckboxState;
    onChange: (ev: any, checked: boolean) => void;
}

export const DuplicateGroupToolbar = ({ group, openDetailed, groupChecked, onChange }: IProps) => {
    const [l10n] = useL10n();
    const onClick = () => openDetailed(group.detailed);
    return (
        <ListItem>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Checkbox
                    indeterminate={groupChecked === CheckboxState.Indeterminate}
                    checked={groupChecked !== CheckboxState.Unchecked}
                    onChange={onChange}
                />
                <Box flexGrow={1}>
                    <DoubleTypeChipBar types={group.types} />
                </Box>
                <Tooltip title={l10n.detailed} placement="top">
                    <IconButton onClick={onClick} size="small" color="secondary">
                        <GraphIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </ListItem>
    );
};
