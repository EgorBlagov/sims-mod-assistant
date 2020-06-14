import * as React from "react";
import { getErrorMessage } from "../../common/errors";
import { useL10n } from "../utils/l10n-hooks";
import { useNotification } from "../utils/notifications";
import { useLoadSettings } from "../utils/settings/settings-hooks";
import "./common.css";
import { GlobalBackdrop } from "./GlobalBackdrop";
import { Main } from "./Main";
import { NotificationSnackbar } from "./NotificationSnackbar";

export const App = () => {
    const [l10n] = useL10n();
    const notification = useNotification();
    useLoadSettings((err) => notification.showError(getErrorMessage(err, l10n)));

    return (
        <>
            <Main />
            <NotificationSnackbar />
            <GlobalBackdrop />
        </>
    );
};
