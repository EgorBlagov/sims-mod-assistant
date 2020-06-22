import { ThemeProvider } from "@material-ui/core";
import React, { useEffect } from "react";
import { getErrorMessage } from "../../common/errors";
import { SettingsThunk } from "../redux/thunk/settings";
import { appTheme } from "../theme";
import { useL10n } from "../utils/l10n-hooks";
import { useNotification } from "../utils/notifications";
import { useThunkDispatch } from "../utils/thunk-hooks";
import "./common.css";
import { GlobalBackdrop } from "./GlobalBackdrop";
import { Main } from "./Main";
import { NotificationSnackbar } from "./NotificationSnackbar";
export const App = () => {
    const [l10n] = useL10n();
    const notification = useNotification();
    const dispatch = useThunkDispatch();

    useEffect(() => {
        dispatch(SettingsThunk.loadRestAndValidate()).catch((err) =>
            notification.showError(getErrorMessage(err, l10n)),
        );
    }, []);

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
