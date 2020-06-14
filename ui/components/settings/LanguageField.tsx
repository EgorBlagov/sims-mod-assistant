import { Box, FormControl, ListItem, ListItemText, makeStyles, MenuItem, Select } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { Language } from "../../../common/l10n";
import { useL10n } from "../../utils/l10n-hooks";

const useStyles = makeStyles({
    formControl: {
        minWidth: 120,
    },
});

interface IProps {
    setLanguage: (l: Language) => void;
}

export const LanguageField = ({ setLanguage }: IProps) => {
    const [l10n, language] = useL10n();
    const classes = useStyles();

    const handleSelectLanguage = (event) => {
        setLanguage(event.target.value);
    };

    return (
        <ListItem>
            <ListItemText primary={l10n.language} />
            <Box display="flex">
                <FormControl className={classes.formControl}>
                    <Select value={language} onChange={handleSelectLanguage}>
                        {_.map(Object.values(Language), (x) => (
                            <MenuItem key={x} value={x}>
                                {x}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </ListItem>
    );
};
