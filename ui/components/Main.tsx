import { Box, Container, Divider, makeStyles } from "@material-ui/core";
import React from "react";
import { AboutButton } from "./about/AboutButton";
import { DirectoryPanel } from "./DirectoryPanel";
import { SettingsButton } from "./settings/SettingsButton";
const useStyles = makeStyles({
    root: {
        overflow: "hidden",
        height: "100vh",
        paddingTop: "1em",
        paddingBottom: "1em",
    },
});

export const Main = () => {
    const classes = useStyles();

    return (
        <Container className={classes.root}>
            <Box display="flex" flexDirection="column" height="100%">
                <Box display="flex" justifyContent="flex-end" mb={1}>
                    <SettingsButton />
                    <AboutButton />
                </Box>

                <Divider variant="middle" />
                <DirectoryPanel />
            </Box>
        </Container>
    );
};
