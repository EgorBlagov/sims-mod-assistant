import { Button, Dialog, DialogContent, DialogTitle, List } from "@material-ui/core";
import * as React from "react";
import { useL10n } from "../../utils/l10n-hooks";
import { LanguageField } from "./LanguageField";
import { SimsStudioPathField } from "./SimsStudioPathField";

export const SettingsButton = () => {
    const [l10n] = useL10n();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleClickOpen = () => setDialogOpen(true);
    const handleClickClose = () => setDialogOpen(false);

    return (
        <>
            <Button size="small" onClick={handleClickOpen}>
                {l10n.settings}
            </Button>
            <Dialog onClose={handleClickClose} open={dialogOpen} fullWidth={true} maxWidth="md">
                <DialogTitle>{l10n.settings}</DialogTitle>
                <DialogContent>
                    <List>
                        <LanguageField />
                        <SimsStudioPathField />
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
};
