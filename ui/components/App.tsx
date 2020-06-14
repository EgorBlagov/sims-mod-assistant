import * as React from "react";
import { useLoadSettings } from "../utils/settings/settings-hooks";
import "./common.css";
import { GlobalBackdrop } from "./GlobalBackdrop";
import { Main } from "./Main";
import { NotificationSnackbar } from "./NotificationSnackbar";

export const App = () => {
    useLoadSettings();

    return (
        <>
            <Main />
            <NotificationSnackbar />
            <GlobalBackdrop />
        </>
    );
};
