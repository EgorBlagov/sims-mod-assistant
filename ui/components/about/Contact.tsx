import { Avatar, Box, IconButton, ListItem, ListItemAvatar, ListItemText, Tooltip } from "@material-ui/core";
import { shell } from "electron";
import _ from "lodash";
import React from "react";
import { preprocessUrl } from "../../utils/url";

export interface IContactIcon {
    icon: React.ReactElement;
    link: string;
}

export interface IContact {
    name: string;
    avatar: string;
    role: string;
    icons: IContactIcon[];
}

export const Contact = ({ name, role, avatar, icons }: IContact) => {
    const handleClick = (link: string) => () => {
        shell.openExternal(preprocessUrl(link));
    };

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar src={avatar} />
            </ListItemAvatar>
            <ListItemText primary={name} secondary={role} />
            <Box display="flex">
                {_.map(icons, (icon) => (
                    <Tooltip key={icon.link} title={icon.link} placement="top">
                        <IconButton onClick={handleClick(icon.link)}>{icon.icon}</IconButton>
                    </Tooltip>
                ))}
            </Box>
        </ListItem>
    );
};
