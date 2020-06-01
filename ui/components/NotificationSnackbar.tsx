import { Slide, Snackbar, SnackbarCloseReason } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as React from "react";
import { NotificationTypes } from "../utils/notifications";

const SNACKBAR_AUTOHIDE_DURATION: number = 5000;

interface IProps {
    message: string;
    type: NotificationTypes;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

export const NotificationSnackbar = ({ message, type, visible, setVisible }: IProps) => {
    const handleClose = (event: React.SyntheticEvent<any, Event>, reason?: SnackbarCloseReason) => {
        if (reason === "clickaway") {
            return;
        }

        setVisible(false);
    };

    return (
        <Snackbar
            key={message + type}
            open={visible}
            onClose={handleClose}
            autoHideDuration={SNACKBAR_AUTOHIDE_DURATION}
            TransitionComponent={SlideTransition}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert variant="filled" severity={type} onClose={handleClose}>
                {message}
            </Alert>
        </Snackbar>
    );
};
