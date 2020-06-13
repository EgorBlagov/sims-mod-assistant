import { Button, Dialog, DialogTitle, List, ListItem, ListItemText } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { Language } from "../../common/l10n";
import { ActionCreators } from "../redux/actions";
import { useL10n } from "../utils/L10n";

export const LanguageButton = () => {
    const [l10n, language] = useL10n();
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const dispatch = useDispatch();
    const setLanguage = (l: Language) => dispatch(ActionCreators.setLanguage(l));

    const handleClickOpen = () => setDialogOpen(true);
    const handleClickLanguage = (value: Language) => () => {
        setDialogOpen(false);
        setLanguage(value);
    };

    return (
        <>
            <Button size="small" onClick={handleClickOpen}>
                {l10n.language}
            </Button>
            <Dialog onClose={handleClickLanguage(language)} open={dialogOpen}>
                <DialogTitle>{l10n.selectLangauge}</DialogTitle>
                <List>
                    {_.map(Object.values(Language), (x) => (
                        <ListItem button={true} onClick={handleClickLanguage(x)} key={x} selected={x === language}>
                            <ListItemText primary={x} />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </>
    );
};
