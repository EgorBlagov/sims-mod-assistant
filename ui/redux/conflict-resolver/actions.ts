import { ISearchResult } from "../../../common/types";
import { Actions, ReduxAction } from "../actions";
import { IFilterParams } from "./reducers";

export type ConflictResolverActions =
    | ConflictResolverSearchSetInProgresstAction
    | ConflictResolverSearchSetResultAction
    | ConflictResolverSetProgressRelativeAction
    | ConflictResolverSelectFiles
    | ConflictResolverSetFilesFilter;

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

export interface ConflictResolverSelectFiles extends ReduxAction {
    type: Actions.CONFLICT_RESOLVER_SELECT_FILES;
    files: string[];
    selected: boolean;
}

export interface ConflictResolverSetFilesFilter extends ReduxAction {
    type: Actions.CONFLICT_RESOLVER_SET_FILES_FILTER;
    filesFilter: IFilterParams;
}
