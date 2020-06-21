import { ISearchResult } from "../../../common/types";
import { Actions, ReduxAction } from "../actions";

export type ConflictResolverActions =
    | ConflictResolverSearchSetInProgresstAction
    | ConflictResolverSearchSetResultAction
    | ConflictResolverSetProgressRelativeAction;

export interface ConflictResolverSearchSetInProgresstAction extends ReduxAction {
    type: Actions.CONFLICT_RESOLVER_SEARCH_SET_SEARCH_IN_PROGRESS;
    inProgress: boolean;
}

export interface ConflictResolverSearchSetResultAction extends ReduxAction {
    type: Actions.CONFLICT_RESOLVER_SEARCH_SET_RESULT;
    result: ISearchResult;
}

export interface ConflictResolverSetProgressRelativeAction extends ReduxAction {
    type: Actions.CONFLICT_RESOLVER_SEARCH_SET_PROGRESS_RELATIVE;
    progressRelative: number;
}
