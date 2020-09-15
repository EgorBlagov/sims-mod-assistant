import { Box, Checkbox, IconButton, ListItem, Tooltip } from "@material-ui/core";
import React from "react";
import { IDuplicateGraph, IDuplicateGroup } from "../../../../common/types";
import { CheckboxState } from "../../../utils/checkbox";
import { useL10n } from "../../../utils/l10n-hooks";
import { GraphIcon } from "../../icons/GraphIcon";
import { DoubleTypeChipBar } from "./DoubleTypeChipBar";

export interface IDuplicateGroupToolbarProps {
    group: IDuplicateGroup;
    openDetailed: (group: IDuplicateGraph) => void;
    groupChecked: CheckboxState;
    onChange: (checked: boolean) => void;
}

export const DuplicateGroupToolbar = ({ group, openDetailed, groupChecked, onChange }: IDuplicateGroupToolbarProps) => {
    const [l10n] = useL10n();
    const onClick = () => openDetailed(group.detailed);
    const onChangeHandler = (event: any, checked: boolean) => onChange(checked);
    return (
        <ListItem>
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Checkbox
                    indeterminate={groupChecked === CheckboxState.Indeterminate}
                    checked={groupChecked !== CheckboxState.Unchecked}
                    onChange={onChangeHandler}
                />
                <Box flexGrow={1}>
                    <DoubleTypeChipBar types={group.summary.types} />
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
