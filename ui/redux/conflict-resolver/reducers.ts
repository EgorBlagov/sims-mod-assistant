import { ISearchResult } from "../../../common/types";
import { Actions } from "../actions";
import { ConflictResolverActions } from "./actions";

export interface ConflictResolverState {
    searchProcess: {
        inProgress: boolean;
        progressRelative: number;
    };
    searchResult: ISearchResult;
}

export const defaultConflictResolverState: ConflictResolverState = {
    searchProcess: {
        inProgress: false,
        progressRelative: 0,
    },
    searchResult: undefined,
};

export const conflictResolver = (
    state = defaultConflictResolverState,
    action: ConflictResolverActions,
): ConflictResolverState => {
    switch (action.type) {
        case Actions.CONFLICT_RESOLVER_SEARCH_SET_SEARCH_IN_PROGRESS:
            return {
                ...state,
                searchProcess: {
                    ...state.searchProcess,
                    inProgress: action.inProgress,
                },
            };

        case Actions.CONFLICT_RESOLVER_SEARCH_SET_RESULT:
            return {
                ...state,
                searchProcess: {
                    ...state.searchProcess,
                    inProgress: false,
                    progressRelative: 0,
                },
                searchResult: action.result,
            };

        case Actions.CONFLICT_RESOLVER_SEARCH_SET_PROGRESS_RELATIVE:
            return {
                ...state,
                searchProcess: {
                    ...state.searchProcess,
                    progressRelative: action.progressRelative,
                },
            };

        default:
            return state;
    }
};
