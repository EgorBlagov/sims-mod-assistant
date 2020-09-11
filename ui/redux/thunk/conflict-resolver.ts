import { ipc } from "../../../common/ipc";
import { isOk } from "../../../common/tools";
import { IDirectoryParams, IIndexResult, ISearchParams, ISearchProgress, TTicketId } from "../../../common/types";
import { ReduxThunkAction } from "../actions";
import { ConflictResolverActions } from "../conflict-resolver/action-creators";

const searchStartAndUpdate = (
    searchParameters: IDirectoryParams & ISearchParams,
): ReduxThunkAction<Promise<void>> => async (dispatch) => {
    let searchTicketId: TTicketId;

    const onProgress = (_: any, progress: ISearchProgress) => {
        if (progress.ticketId === searchTicketId) {
            dispatch(ConflictResolverActions.setProgress(progress.progressRelative));
        }
    };

    try {
        ipc.renderer.on.searchProgress(onProgress);
        const startResult = await ipc.renderer.rpc.startSearch(searchParameters);
        searchTicketId = startResult.searchTicketId;
        dispatch(ConflictResolverActions.cleanupSearch());
        dispatch(ConflictResolverActions.setInProgress(true));

        const indexResult = await new Promise<IIndexResult>((resolve, reject) => {
            ipc.renderer.on.searchResult((_, searchIndexResult) => {
                if (searchIndexResult.ticketId === searchTicketId) {
                    resolve(searchIndexResult);
                }
            });

            ipc.renderer.on.searchError((_, error) => {
                if (error.ticketId === searchTicketId) {
                    reject(error.error);
                }
            });
        });

        dispatch(ConflictResolverActions.setIndexResult(indexResult));
    } catch (error) {
        dispatch(ConflictResolverActions.cleanupSearch());
        throw error;
    } finally {
        ipc.renderer.off.searchProgress(onProgress);
        dispatch(ConflictResolverActions.setInProgress(false));
    }
};

const selectAll = (selected: boolean): ReduxThunkAction => (dispatch, getState) => {
    const searchResult = getState().conflictResolver.searchResult;
    if (isOk(searchResult)) {
        dispatch(
            ConflictResolverActions.selectFiles(
                searchResult.duplicates.reduce(
                    (prev, g) => prev.concat(g.detailed.nodes.map((n) => n.path)),
                    [] as string[],
                ),
                selected,
            ),
        );
    }
};

export const ConflictResolverThunk = {
    searchStartAndUpdate,
    selectAll,
};
