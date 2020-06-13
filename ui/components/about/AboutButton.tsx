import { Button, Dialog, DialogContent, DialogTitle, List, Typography } from "@material-ui/core";
import Github from "@material-ui/icons/GitHub";
import Mail from "@material-ui/icons/Mail";
import _ from "lodash";
import * as React from "react";
import assistantAvatar from "../../../assets/assistant-avatar.png";
import authorAvatar from "../../../assets/author-avatar.png";
import pjson from "../../../package.json";
import { useL10n } from "../../utils/l10n-hooks";
import { PatreonIcon } from "../icons/PatreonIcon";
import { Contact, IContact } from "./Contact";

export const AboutButton = () => {
    const [l10n] = useL10n();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleClickOpen = () => setDialogOpen(true);
    const handleClickClose = () => setDialogOpen(false);

    const contacts: IContact[] = [
        {
            avatar: authorAvatar,
            icons: [
                {
                    icon: <Github />,
                    link: pjson.contacts.authorGithub,
                },
                {
                    icon: <Mail />,
                    link: pjson.contacts.authorEmail,
                },
            ],
            name: pjson.author,
            role: l10n.author,
        },
        {
            avatar: assistantAvatar,
            icons: [
                {
                    icon: <PatreonIcon />,
                    link: pjson.contacts.assistantPatreon,
                },
                {
                    icon: <Mail />,
                    link: pjson.contacts.assistantEmail,
                },
            ],
            name: pjson.contacts.assistant,
            role: l10n.assistant,
        },
    ];

    return (
        <>
            <Button size="small" onClick={handleClickOpen}>
                {l10n.about}
            </Button>
            <Dialog onClose={handleClickClose} open={dialogOpen}>
                <DialogTitle>{l10n.about}</DialogTitle>
                <DialogContent>
                    <Typography variant="h5" component="h2">
                        {pjson.nameLong} {pjson.version}
                    </Typography>
                    <Typography color="textSecondary">{l10n.description}</Typography>
                    <br />
                    <List>
                        {_.map(contacts, (c) => (
                            <Contact key={c.name} {...c} />
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
};
