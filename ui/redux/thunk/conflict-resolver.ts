import { ipc } from "../../../common/ipc";
import { IDirectoryParams, ISearchParams, ISearchProgress, ISearchResult, TTicketId } from "../../../common/types";
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
        dispatch(ConflictResolverActions.setResult(undefined));
        dispatch(ConflictResolverActions.setInProgress(true));

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

        dispatch(ConflictResolverActions.setResult(searchResult));
    } catch (error) {
        dispatch(ConflictResolverActions.setResult(undefined));
        throw error;
    } finally {
        ipc.renderer.off.searchProgress(onProgress);
        dispatch(ConflictResolverActions.setInProgress(false));
    }
};

export const ConflictResolverThunk = {
    searchStartAndUpdate,
};
