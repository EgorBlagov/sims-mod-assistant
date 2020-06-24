import { Box, Button, Collapse, LinearProgress, makeStyles } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { TState } from "../redux/reducers";
import { useL10n } from "../utils/l10n-hooks";
import { EstimatedTime } from "./EstimatedTime";

interface IProps {
    interruptSearch: () => void;
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

export const ProgressBar = ({ interruptSearch }: IProps) => {
    const classes = useStyles();
    const [l10n] = useL10n();
    const { progressRelative, inProgress } = useSelector((state: TState) => state.conflictResolver.searchProcess);
    const [searchStartTime, setSearchStartTime] = React.useState<Date>();

    React.useEffect(() => {
        if (inProgress) {
            setSearchStartTime(new Date());
        } else {
            setSearchStartTime(undefined);
        }
    }, [inProgress]);

    return (
        <Collapse in={inProgress}>
            <Box my={1}>
                <Box display="flex" justifyContent="center">
                    <EstimatedTime progressRelative={progressRelative} startTime={searchStartTime} />
                </Box>
                <Box display="flex" alignItems="center">
                    <Box flex="auto" mr={1}>
                        <LinearProgress value={progressRelative * 100} variant="determinate" classes={classes} />
                    </Box>
                    <Button onClick={interruptSearch}>{l10n.cancel}</Button>
                </Box>
            </Box>
        </Collapse>
    );
};
