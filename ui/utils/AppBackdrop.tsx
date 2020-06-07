import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import * as React from "react";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
}));

interface IProps {
    show: boolean;
}

export const AppBackdrop = ({ show }: IProps) => {
    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={show}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};
