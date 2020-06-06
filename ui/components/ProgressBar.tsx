import { LinearProgress, makeStyles } from "@material-ui/core";
import * as React from "react";

interface IProps {
    progressRelative: number;
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

export const ProgressBar = ({ progressRelative }: IProps) => {
    const classes = useStyles();
    return <LinearProgress value={progressRelative * 100} variant="determinate" classes={classes} />;
};
