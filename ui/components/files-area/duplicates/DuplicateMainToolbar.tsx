import { AppBar, Box, Button, Checkbox, InputAdornment, TextField, Tooltip } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { remote } from "electron";
import React from "react";
import { useSelector } from "react-redux";
import { getErrorMessage } from "../../../../common/errors";
import { ipc } from "../../../../common/ipc";
import { ConflictResolverActions } from "../../../redux/conflict-resolver/action-creators";
import { TState } from "../../../redux/reducers";
import { ConflictResolverThunk } from "../../../redux/thunk/conflict-resolver";
import { useBackdropBound } from "../../../utils/backdrop-hooks";
import { CheckboxState, getCheckboxState } from "../../../utils/checkbox";
import { isFilterUsed, isFilterValid, pathFilter } from "../../../utils/filter";
import { useL10n } from "../../../utils/l10n-hooks";
import { useNotification } from "../../../utils/notifications";
import { useThunkDispatch } from "../../../utils/thunk-hooks";
import { CaseIcon } from "../../icons/CaseIcon";
import { CheckboxIcon } from "../../icons/CheckboxIcon";
import { RegexIcon } from "../../icons/RegexIcon";
export const DuplicateMainToolbar = () => {
    const dispatch = useThunkDispatch();
    const { filesFilter, selectedConflictFiles } = useSelector((state: TState) => state.conflictResolver);
    const searchDirectory = useSelector((state: TState) => state.conflictResolver.searchDirectory);
    const notification = useNotification();
    const [l10n] = useL10n();
    const [moveDisabled, setMoveDisabled] = React.useState<boolean>(false);
    useBackdropBound(moveDisabled);

    const setAllChecked = (checked: boolean) => {
        dispatch(ConflictResolverThunk.selectAll(checked));
    };
    const filteredPath = Object.keys(selectedConflictFiles).filter(pathFilter(filesFilter));
    const selectedPaths = filteredPath.filter((p) => selectedConflictFiles[p]);

    const moveItems = async () => {
        setMoveDisabled(true);
        try {
            const dialogResult = await remote.dialog.showOpenDialog({ properties: ["openDirectory"] });
            if (!dialogResult.canceled) {
                await ipc.renderer.rpc.moveDuplicates({
                    targetDir: dialogResult.filePaths[0],
                    searchDir: searchDirectory,
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
        moveItems().catch((err) => notification.showError(l10n.errorMove(getErrorMessage(err, l10n))));
    };

    const globalSelectHandler = (event: React.ChangeEvent<HTMLInputElement>) => setAllChecked(event.target.checked);
    const allChecked = getCheckboxState(filteredPath.length, selectedPaths.length);

    const setFilterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
            ConflictResolverActions.setFilter({
                ...filesFilter,
                filter: event.target.value,
            }),
        );
    };

    const setRegexHandler = (checked: boolean) => {
        dispatch(
            ConflictResolverActions.setFilter({
                ...filesFilter,
                isRegex: checked,
            }),
        );
    };

    const setCaseSensitiveHandler = (checked: boolean) => {
        dispatch(
            ConflictResolverActions.setFilter({
                ...filesFilter,
                isCaseSensitive: checked,
            }),
        );
    };

    return (
        <AppBar color="transparent" position="static">
            <Box display="flex" p={2}>
                <Checkbox
                    indeterminate={allChecked === CheckboxState.Indeterminate}
                    checked={allChecked !== CheckboxState.Unchecked}
                    onChange={globalSelectHandler}
                />
                <Box flexGrow={1} alignItems="center" display="flex" px={1}>
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
                    <Tooltip title={l10n.caseHelp}>
                        <span>
                            <CheckboxIcon
                                IconComponent={CaseIcon}
                                onChange={setCaseSensitiveHandler}
                                value={filesFilter.isCaseSensitive}
                            />
                        </span>
                    </Tooltip>
                    <Tooltip title={l10n.regexHelp}>
                        <span>
                            <CheckboxIcon
                                IconComponent={RegexIcon}
                                onChange={setRegexHandler}
                                value={filesFilter.isRegex}
                            />
                        </span>
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
