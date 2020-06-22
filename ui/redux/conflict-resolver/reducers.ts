import { isOk } from "../../../common/tools";
import { ISearchResult } from "../../../common/types";
import { Actions } from "../actions";
import { ConflictResolverActions } from "./actions";

export interface ISelectedFilesInfo {
    [path: string]: boolean;
}

export interface ConflictResolverState {
    searchProcess: {
        inProgress: boolean;
        progressRelative: number;
    };
    searchResult: ISearchResult;
    selectedConflictFiles: ISelectedFilesInfo;
}

export const defaultConflictResolverState: ConflictResolverState = {
    searchProcess: {
        inProgress: false,
        progressRelative: 0,
    },
    searchResult: undefined,
    selectedConflictFiles: {},
};

const conflictFilesUpdate = (state: ISelectedFilesInfo, newSearchResult: ISearchResult): ISelectedFilesInfo => {
    if (isOk(newSearchResult)) {
        const newSelectedFiles: ISelectedFilesInfo = {};

        for (const group of newSearchResult.duplicates) {
            for (const node of group.detailed.nodes) {
                newSelectedFiles[node.path] = node.path in state ? state[node.path] : false;
            }
        }

        return newSelectedFiles;
    }

    return {};
};

const conflictFilesSelect = (state: ISelectedFilesInfo, files: string[], selected: boolean): ISelectedFilesInfo => {
    const newState: ISelectedFilesInfo = { ...state };
    for (const file of files) {
        if (file in newState) {
            newState[file] = selected;
        }
    }

    return newState;
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
                selectedConflictFiles: conflictFilesUpdate(state.selectedConflictFiles, action.result),
            };

        case Actions.CONFLICT_RESOLVER_SEARCH_SET_PROGRESS_RELATIVE:
            return {
                ...state,
                searchProcess: {
                    ...state.searchProcess,
                    progressRelative: action.progressRelative,
                },
            };

        case Actions.CONFLICT_RESOLVER_SELECT_FILES:
            return {
                ...state,
                selectedConflictFiles: conflictFilesSelect(state.selectedConflictFiles, action.files, action.selected),
            };

        default:
            return state;
    }
};
