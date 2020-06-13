import { Box, Container, Divider, makeStyles } from "@material-ui/core";
import * as React from "react";
import { AboutButton } from "./about/AboutButton";
import { DirectoryPanel } from "./DirectoryPanel";
import { LanguageButton } from "./LanguageButton";

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
                    <LanguageButton />
                    <AboutButton />
                </Box>

                <Divider variant="middle" />
                <DirectoryPanel />
            </Box>
        </Container>
    );
};
