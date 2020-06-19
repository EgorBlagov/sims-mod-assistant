import { Button } from "@material-ui/core";
import * as React from "react";
import { useL10n } from "../../utils/l10n-hooks";
import { AboutDialog } from "./AboutDialog";

export const AboutButton = () => {
    const [l10n] = useL10n();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleClickOpen = () => setDialogOpen(true);
    const handleClickClose = () => setDialogOpen(false);

    return (
        <>
            <Button size="small" onClick={handleClickOpen}>
                {l10n.about}
            </Button>
            <AboutDialog visible={dialogOpen} close={handleClickClose} />
        </>
    );
};
