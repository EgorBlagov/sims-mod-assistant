import { LinearProgress, makeStyles } from "@material-ui/core";
import * as React from "react";

interface IProps {
    progress: number;
}

const useStyles = makeStyles(() => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    bar: {
        borderRadius: 5,
    },
}));

export const ProgressBar = ({ progress }: IProps) => {
    const classes = useStyles();

    return <LinearProgress value={progress} variant="determinate" classes={classes} />;
};
