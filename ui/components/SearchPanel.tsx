import { Box, Grow } from "@material-ui/core";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getErrorMessage } from "../../common/errors";
import { ipc } from "../../common/ipc";
import { ISearchParams } from "../../common/types";
import { ConflictResolverActions } from "../redux/conflict-resolver/action-creators";
import { TState } from "../redux/reducers";
import { ConflictResolverThunk } from "../redux/thunk/conflict-resolver";
import { useL10n } from "../utils/l10n-hooks";
import { useNotification } from "../utils/notifications";
import { useThunkDispatch } from "../utils/thunk-hooks";
import { FilesArea } from "./files-area/FilesArea";
import { ProgressBar } from "./ProgressBar";
import { SearchParametersForm } from "./SearchParametersForm";
import { StartButton } from "./StartButton";

export const SearchPanel = () => {
    const [l10n] = useL10n();
    const [params, setParams] = React.useState<ISearchParams>({ searchMd5: true, searchTgi: false });
    const {
        searchProcess: { inProgress },
        searchResult,
    } = useSelector((state: TState) => state.conflictResolver);

    const notification = useNotification();
    const dispatch = useThunkDispatch();
    const targetPath = useSelector((state: TState) => state.conflictResolver.searchDirectory);

    const interruptSearch = () => {
        ipc.renderer.rpc.interruptSearch().catch((err) => notification.showError(getErrorMessage(err, l10n)));
    };

    useEffect(() => {
        dispatch(ConflictResolverActions.cleanupSearch());
        return interruptSearch;
    }, []);

    const startSearch = () => {
        if (!inProgress) {
            dispatch(ConflictResolverThunk.searchStartAndUpdate({ targetPath, ...params }))
                .then(() => notification.showSuccess(l10n.searchFinished))
                .catch((err) => notification.showError(getErrorMessage(err, l10n)));
        }
    };

    return (
        <>
            <SearchParametersForm editable={!inProgress} params={params} setParams={setParams} />
            <ProgressBar interruptSearch={interruptSearch} />
            <Grow in={!inProgress}>
                <Box display="flex" justifyContent="center">
                    <StartButton params={params} onClick={startSearch} />
                </Box>
            </Grow>
            <FilesArea searchInfo={searchResult} />
        </>
    );
};
