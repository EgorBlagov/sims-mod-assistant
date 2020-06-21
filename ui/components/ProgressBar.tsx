import { Box, Button, Collapse, LinearProgress, makeStyles } from "@material-ui/core";
import React from "react";
import { isOk } from "../../common/tools";
import { TTicketId } from "../../common/types";
import { ipcHooks } from "../utils/ipc-hooks";
import { useL10n } from "../utils/l10n-hooks";
import { EstimatedTime } from "./EstimatedTime";

interface IProps {
    ticketId: TTicketId;
    interruptSearch: () => void;
    searchDone: boolean;
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

export const ProgressBar = ({ ticketId, searchDone, interruptSearch }: IProps) => {
    const classes = useStyles();
    const [l10n] = useL10n();
    const [progressRelative, setProgressRelative] = React.useState<number>(0);
    const [searchStartTime, setSearchStartTime] = React.useState<Date>();

    ipcHooks.use.searchProgress((___, args) => {
        if (ticketId === args.ticketId) {
            setProgressRelative(args.progressRelative);
        }
    });

    React.useEffect(() => {
        if (isOk(ticketId)) {
            setSearchStartTime(new Date());
        } else {
            setSearchStartTime(undefined);
            setProgressRelative(0);
        }
    }, [ticketId]);

    return (
        <Collapse in={isOk(ticketId) && !searchDone}>
            <Box my={1} display="flex" alignItems="center">
                <Box flex="auto" mr={1}>
                    <LinearProgress value={progressRelative * 100} variant="determinate" classes={classes} />{" "}
                </Box>
                <Box mr={1}>
                    <EstimatedTime progressRelative={progressRelative} startTime={searchStartTime} />
                </Box>
                <Button onClick={interruptSearch}>{l10n.cancel}</Button>
            </Box>
        </Collapse>
    );
};
