import { ipc } from "../../../common/ipc";
import { IDirectoryParams, ISearchParams, ISearchProgress, ISearchResult, TTicketId } from "../../../common/types";
import { Actions, ReduxThunkAction } from "../actions";
import {
    ConflictResolverSearchSetInProgresstAction,
    ConflictResolverSearchSetResultAction,
    ConflictResolverSetProgressRelativeAction,
} from "./actions";

const setInProgress = (inProgress: boolean): ConflictResolverSearchSetInProgresstAction => ({
    type: Actions.CONFLICT_RESOLVER_SEARCH_SET_SEARCH_IN_PROGRESS,
    inProgress,
});

const setResult = (result: ISearchResult): ConflictResolverSearchSetResultAction => ({
    type: Actions.CONFLICT_RESOLVER_SEARCH_SET_RESULT,
    result,
});

const setProgress = (progressRelative: number): ConflictResolverSetProgressRelativeAction => ({
    type: Actions.CONFLICT_RESOLVER_SEARCH_SET_PROGRESS_RELATIVE,
    progressRelative,
});

export const conflictResolverCleanupSearch = (): ConflictResolverSearchSetResultAction => ({
    type: Actions.CONFLICT_RESOLVER_SEARCH_SET_RESULT,
    result: undefined,
});

export const conflictResolverSearchStartAndUpdate = (
    searchParameters: IDirectoryParams & ISearchParams,
): ReduxThunkAction<Promise<void>> => async (dispatch, getState) => {
    let searchTicketId: TTicketId;

    const onProgress = (_, progress: ISearchProgress) => {
        if (progress.ticketId === searchTicketId) {
            dispatch(setProgress(progress.progressRelative));
        }
    };

    try {
        ipc.renderer.on.searchProgress(onProgress);
        const startResult = await ipc.renderer.rpc.startSearch(searchParameters);
        searchTicketId = startResult.searchTicketId;
        dispatch(setResult(undefined));
        dispatch(setInProgress(true));

        const searchResult = await new Promise<ISearchResult>((resolve, reject) => {
            ipc.renderer.on.searchResult((_, readyTicketId) => {
                if (readyTicketId === searchTicketId) {
                    ipc.renderer.rpc.getSearchResult(searchTicketId).then(resolve);
                }
            });

            ipc.renderer.on.searchError((_, error) => {
                if (error.ticketId === searchTicketId) {
                    reject(error.error);
                }
            });
        });

        dispatch(setResult(searchResult));
    } catch (error) {
        dispatch(setResult(undefined));
        throw error;
    } finally {
        ipc.renderer.off.searchProgress(onProgress);
        setInProgress(false);
    }
};
