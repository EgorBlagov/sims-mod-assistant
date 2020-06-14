import { Slide, Snackbar, SnackbarCloseReason } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ActionCreators from "../redux/action-creators";
import { TState } from "../redux/reducers";

const SNACKBAR_AUTOHIDE_DURATION: number = 5000;

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

export const NotificationSnackbar = () => {
    const { message, type, visible } = useSelector((state: TState) => state.notification);
    const dispatch = useDispatch();
    const hide = () => dispatch(ActionCreators.notificationSetVisible(false));

    const handleClose = (event: React.SyntheticEvent<any, Event>, reason?: SnackbarCloseReason) => {
        if (reason === "clickaway") {
            return;
        }

        hide();
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
