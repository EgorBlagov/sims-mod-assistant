import { AppBar, Box, Button, InputAdornment, makeStyles, TextField, Tooltip } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { remote } from "electron";
import React from "react";
import { useSelector } from "react-redux";
import { ipc } from "../../../../common/ipc";
import { ConflictResolverActions } from "../../../redux/conflict-resolver/action-creators";
import { TState } from "../../../redux/reducers";
import { ConflictResolverThunk } from "../../../redux/thunk/conflict-resolver";
import { useBackdropBound } from "../../../utils/backdrop-hooks";
import { useL10n } from "../../../utils/l10n-hooks";
import { useNotification } from "../../../utils/notifications";
import { isFilterUsed, isFilterValid } from "../../../utils/regex";
import { useThunkDispatch } from "../../../utils/thunk-hooks";

const useStyles = makeStyles((theme) => ({
    spacingRight: {
        marginRight: theme.spacing(1),
    },
}));

export const DuplicateMainToolbar = () => {
    const dispatch = useThunkDispatch();
    const { filesFilter, selectedConflictFiles: checkedItems } = useSelector((state: TState) => state.conflictResolver);
    const notification = useNotification();
    const [l10n] = useL10n();
    const [moveDisabled, setMoveDisabled] = React.useState<boolean>(false);
    const classes = useStyles();

    useBackdropBound(moveDisabled);

    const setAllChecked = (checked: boolean) => {
        dispatch(ConflictResolverThunk.selectAll(checked));
    };

    const selectedPaths = Object.entries(checkedItems)
        .filter(([__, checked]) => checked)
        .map(([p]) => p);

    const moveItems = async () => {
        setMoveDisabled(true);
        try {
            const dialogResult = await remote.dialog.showOpenDialog({ properties: ["openDirectory"] });
            if (!dialogResult.canceled) {
                await ipc.renderer.rpc.moveDuplicates({
                    targetDir: dialogResult.filePaths[0],
                    filePaths: selectedPaths,
                });
                notification.showSuccess(l10n.moveSuccess);
                // TODO: view update logic
            }
        } finally {
            setMoveDisabled(false);
        }
    };

    const openDalog = () => {
        moveItems().catch((err) => notification.showError(l10n.errorMove(err.message)));
    };

    const selectAll = () => setAllChecked(true);
    const clearSelection = () => setAllChecked(false);

    const setFilterHandler = (event) => {
        dispatch(
            ConflictResolverActions.setFilter({
                filter: event.target.value,
                isRegex: true, // TODO: add input
            }),
        );
    };

    return (
        <AppBar color="transparent" position="static">
            <Box display="flex" p={2}>
                <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.spacingRight}
                    size="small"
                    onClick={selectAll}
                >
                    {l10n.selectAll}
                </Button>

                <Button variant="outlined" color="secondary" size="small" onClick={clearSelection}>
                    {l10n.clearSelection}
                </Button>
                <Box flexGrow={1} alignItems="center" display="flex" px={1}>
                    <Tooltip title={l10n.regexHelp}>
                        <TextField
                            error={isFilterUsed(filesFilter) && !isFilterValid(filesFilter)}
                            fullWidth={true}
                            placeholder={l10n.searchPlaceholder}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            value={filesFilter.filter}
                            onChange={setFilterHandler}
                        />
                    </Tooltip>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={openDalog}
                    disabled={moveDisabled || selectedPaths.length === 0}
                >
                    {l10n.moveDuplicates}
                </Button>
            </Box>
        </AppBar>
    );
};
