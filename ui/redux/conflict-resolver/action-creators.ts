import { ISearchResult } from "../../../common/types";
import { Actions } from "../actions";
import {
    ConflictResolverSearchSetInProgresstAction,
    ConflictResolverSearchSetResultAction,
    ConflictResolverSelectFiles,
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

const cleanupSearch = (): ConflictResolverSearchSetResultAction => ({
    type: Actions.CONFLICT_RESOLVER_SEARCH_SET_RESULT,
    result: undefined,
});

const selectFiles = (files: string[], selected: boolean): ConflictResolverSelectFiles => ({
    type: Actions.CONFLICT_RESOLVER_SELECT_FILES,
    files,
    selected,
});

export const ConflictResolverActions = {
    setInProgress,
    setResult,
    setProgress,
    cleanupSearch,
    selectFiles,
};
