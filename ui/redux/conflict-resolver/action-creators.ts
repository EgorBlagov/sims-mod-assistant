import { ISearchResult } from "../../../common/types";
import { Actions } from "../actions";
import {
    ConflictResolverSearchSetInProgresstAction,
    ConflictResolverSearchSetResultAction,
    ConflictResolverSelectFiles,
    ConflictResolverSetFilesFilter,
    ConflictResolverSetProgressRelativeAction,
    ConflictResolverSetSearchDirectory,
} from "./actions";
import { IFilterParams } from "./reducers";

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

const setSearchDirectory = (searchDirectory: string): ConflictResolverSetSearchDirectory => ({
    type: Actions.CONFLICT_RESOLVER_SET_SEARCH_DIRECTORY,
    searchDirectory,
});

const cleanupSearch = (): ConflictResolverSearchSetResultAction => ({
    type: Actions.CONFLICT_RESOLVER_SEARCH_SET_RESULT,
    result: undefined,
});

const selectFiles = (files: string[], selected: boolean): ConflictResolverSelectFiles => ({
    type: Actions.CONFLICT_RESOLVER_SELECT_FILES,
    files,
    selected,
});

const setFilter = (filesFilter: IFilterParams): ConflictResolverSetFilesFilter => ({
    type: Actions.CONFLICT_RESOLVER_SET_FILES_FILTER,
    filesFilter,
});

export const ConflictResolverActions = {
    setInProgress,
    setResult,
    setProgress,
    cleanupSearch,
    selectFiles,
    setFilter,
    setSearchDirectory,
};
