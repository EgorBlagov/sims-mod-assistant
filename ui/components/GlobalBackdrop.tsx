import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import * as React from "react";
import { useSelector } from "react-redux";
import { TState } from "../redux/reducers";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
}));

export const GlobalBackdrop = () => {
    const visible = useSelector((state: TState) => state.backdrop.visible);
    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={visible}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};
