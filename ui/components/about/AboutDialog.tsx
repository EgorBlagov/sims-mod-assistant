import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    Tooltip,
    Typography,
} from "@material-ui/core";
import Github from "@material-ui/icons/GitHub";
import Mail from "@material-ui/icons/Mail";
import { shell } from "electron";
import _ from "lodash";
import React from "react";
import assistantAvatar from "../../../assets/assistant-avatar.png";
import authorAvatar from "../../../assets/author-avatar.png";
import pjson from "../../../package.json";
import { useL10n } from "../../utils/l10n-hooks";
import { preprocessUrl } from "../../utils/url";
import { PatreonIcon } from "../icons/PatreonIcon";
import { Contact, IContact } from "./Contact";

interface IProps {
    visible: boolean;
    close: () => void;
}

export const AboutDialog = ({ visible, close }: IProps) => {
    const [l10n] = useL10n();
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
    const openHomepage = () => shell.openExternal(preprocessUrl(pjson.contacts.homepage));

    return (
        <Dialog onClose={close} open={visible}>
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
                    <ListItem>
                        <Box display="flex" justifyContent="center" width="100%">
                            <Tooltip title={pjson.contacts.homepage} placement="top">
                                <Button onClick={openHomepage} color="primary" variant="contained">
                                    {l10n.homepage}
                                </Button>
                            </Tooltip>
                        </Box>
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
    );
};
