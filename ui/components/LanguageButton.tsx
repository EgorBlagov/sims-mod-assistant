import { Button, Dialog, DialogTitle, List, ListItem, ListItemText } from "@material-ui/core";
import * as _ from "lodash";
import * as React from "react";
import { Language } from "../../common/l10n";
import { useL10n } from "../utils/L10n";

interface IProps {
    setLanguage: (newLanguage: Language) => void;
}

export const LanguageButton = ({ setLanguage }: IProps) => {
    const [l10n, language] = useL10n();
    const [dialogOpen, setDialogOpen] = React.useState(false);
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
