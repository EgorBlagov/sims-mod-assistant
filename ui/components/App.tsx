import { ThemeProvider } from "@material-ui/core";
import * as React from "react";
import { appTheme } from "../theme";
import { useLoadSettings } from "../utils/settings/settings-hooks";
import "./common.css";
import { GlobalBackdrop } from "./GlobalBackdrop";
import { Main } from "./Main";
import { NotificationSnackbar } from "./NotificationSnackbar";

export const App = () => {
    useLoadSettings();

    return (
        <>
            <ThemeProvider theme={appTheme}>
                <Main />
                <NotificationSnackbar />
                <GlobalBackdrop />
            </ThemeProvider>
        </>
    );
};
