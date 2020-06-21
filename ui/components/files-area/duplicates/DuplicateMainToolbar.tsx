import { AppBar, Box, Button, InputAdornment, makeStyles, TextField, Tooltip } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { remote } from "electron";
import React from "react";
import { ipc } from "../../../../common/ipc";
import { useBackdropBound } from "../../../utils/backdrop-hooks";
import { useL10n } from "../../../utils/l10n-hooks";
import { useNotification } from "../../../utils/notifications";
import { isValidRegex } from "../../../utils/regex";

interface IProps {
    selectedPaths: string[];
    setChecked: (checked: boolean) => void;
    filter: string;
    setFilter: (newFilter: string) => void;
}

const useStyles = makeStyles((theme) => ({
    spacingRight: {
        marginRight: theme.spacing(1),
    },
}));

export const DuplicateMainToolbar = ({ selectedPaths, setChecked, filter, setFilter }: IProps) => {
    const [l10n] = useL10n();
    const classes = useStyles();

    const notification = useNotification();
    const [moveDisabled, setMoveDisabled] = React.useState<boolean>(false);
    useBackdropBound(moveDisabled);

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

    const selectAll = () => setChecked(true);
    const clearSelection = () => setChecked(false);

    const setFilterHandler = (event) => {
        setFilter(event.target.value);
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
                            error={!isValidRegex(filter)}
                            fullWidth={true}
                            placeholder={l10n.searchPlaceholder}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            value={filter}
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
