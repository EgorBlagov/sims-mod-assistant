import { Box, Checkbox, ListItem, ListItemText, Tooltip } from "@material-ui/core";
import path from "path";
import React from "react";
import { useL10n } from "../../../utils/l10n-hooks";
import { usePathStyles } from "../tools";
import { DuplicateToolbar } from "./DuplicateToolbar";

export interface IDuplicateGroupEntryProps {
    filePath: string;
    checked: boolean;
    modifiedDate: Date;
    onChange: (newValue: boolean) => void;
}

export const DuplicateGroupEntry = ({ filePath, checked, onChange, modifiedDate }: IDuplicateGroupEntryProps) => {
    const [l10n] = useL10n();
    const pathClasses = usePathStyles();

    const onChangeHandler = (event: any, newChecked: boolean) => onChange(newChecked);

    return (
        <ListItem key={filePath}>
            <Checkbox color="primary" checked={checked} onChange={onChangeHandler} />
            <Tooltip title={filePath}>
                <ListItemText
                    className={pathClasses.base}
                    primary={path.basename(filePath)}
                    secondary={l10n.date(modifiedDate)}
                />
            </Tooltip>
            <Box flexGrow={1}>
                <DuplicateToolbar path={filePath} />
            </Box>
        </ListItem>
    );
};
