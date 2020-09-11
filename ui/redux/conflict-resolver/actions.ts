import { IIndexResult, IIndexUpdate } from "../../../common/types";
import { Actions, ReduxAction } from "../actions";
import { IFilterParams } from "./reducers";

export type ConflictResolverActions =
    | ConflictResolverSearchSetInProgresstAction
    | ConflictResolverSearchSetResultAction
    | ConflictResolverSetProgressRelativeAction
    | ConflictResolverSelectFiles
    | ConflictResolverSetFilesFilter
    | ConflictResolverSetSearchDirectory
    | ConflictResolverUpdateIndex;

export interface ConflictResolverSearchSetInProgresstAction extends ReduxAction {
    type: Actions.CONFLICT_RESOLVER_SEARCH_SET_SEARCH_IN_PROGRESS;
    inProgress: boolean;
}

export interface ConflictResolverSearchSetResultAction extends ReduxAction {
    type: Actions.CONFLICT_RESOLVER_SEARCH_SET_RESULT;
    result: IIndexResult;
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

export interface ConflictResolverSetSearchDirectory extends ReduxAction {
    type: Actions.CONFLICT_RESOLVER_SET_SEARCH_DIRECTORY;
    searchDirectory: string;
}

export interface ConflictResolverUpdateIndex extends ReduxAction {
    type: Actions.CONFLICT_RESOLVER_UPDATE_INDEX;
    indexUpdate: IIndexUpdate;
}
