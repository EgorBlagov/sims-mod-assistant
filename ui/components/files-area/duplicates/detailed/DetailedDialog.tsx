import { AppBar, Box, Dialog, IconButton, makeStyles, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { isOk } from "../../../../../common/tools";
import { IDuplicateGraph } from "../../../../../common/types";
import { useL10n } from "../../../../utils/l10n-hooks";
import { D3Graph } from "./D3Graph";

interface IProps {
    visible: boolean;
    close: () => void;
    graph: IDuplicateGraph;
}

const useStyles = makeStyles({
    appBar: {
        position: "relative",
    },
    title: {
        flexGrow: 1,
    },
});

export const DetailedDialog = ({ visible, close, graph }: IProps) => {
    const [l10n] = useL10n();
    const classes = useStyles();
    if (!isOk(graph)) {
        return null;
    }

    return (
        <Dialog onClose={close} open={visible} fullScreen={true}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        {l10n.detailed}
                    </Typography>
                    <IconButton edge="start" color="inherit" onClick={close} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box height="100%">
                <AutoSizer>
                    {({ height, width }) => <D3Graph height={height} width={width} graph={graph} l10n={l10n} />}
                </AutoSizer>
            </Box>
        </Dialog>
    );
};
