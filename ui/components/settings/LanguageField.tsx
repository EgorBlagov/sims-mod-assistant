import { Box, FormControl, ListItem, ListItemText, makeStyles, MenuItem, Select } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { Language } from "../../../common/l10n";
import * as ActionCreators from "../../redux/action-creators";
import { useL10n } from "../../utils/l10n-hooks";

const useStyles = makeStyles({
    formControl: {
        minWidth: 120,
    },
});

export const LanguageField = () => {
    const [l10n, language] = useL10n();
    const classes = useStyles();
    const dispatch = useDispatch();
    const setLanguage = (l: Language) => dispatch(ActionCreators.setLanguage(l));

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
