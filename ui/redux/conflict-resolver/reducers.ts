import { isOk } from "../../../common/tools";
import { IIndexUpdate, IndexChanges, ISearchResult } from "../../../common/types";
import { pathFilter } from "../../utils/filter";
import { GraphAggregator } from "../../utils/graph-aggregator";
import { Actions } from "../actions";
import { ConflictResolverActions } from "./actions";

export interface ISelectedFilesInfo {
    [path: string]: boolean;
}

export interface IFilterParams {
    filter: string;
    isRegex: boolean;
    isCaseSensitive: boolean;
}

export interface ConflictResolverState {
    searchProcess: {
        inProgress: boolean;
        progressRelative: number;
    };
    searchDirectory: string;
    searchResult: ISearchResult;
    selectedConflictFiles: ISelectedFilesInfo;
    filesFilter: IFilterParams;
}

export const defaultConflictResolverState: ConflictResolverState = {
    searchProcess: {
        inProgress: false,
        progressRelative: 0,
    },
    searchDirectory: undefined,
    searchResult: undefined,
    selectedConflictFiles: {},
    filesFilter: {
        filter: "",
        isRegex: false,
        isCaseSensitive: false,
    },
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

const conflictFilesSelect = (state: ConflictResolverState, files: string[], selected: boolean): ISelectedFilesInfo => {
    const newState: ISelectedFilesInfo = { ...state.selectedConflictFiles };
    const filter = state.filesFilter;
    for (const file of files.filter(pathFilter(filter))) {
        if (file in newState) {
            newState[file] = selected;
        }
    }

    return newState;
};

const indexUpdate = (state: ISearchResult, indexUpdateInfo: IIndexUpdate): ISearchResult => {
    const result: ISearchResult = {
        ticketId: state.ticketId,
        index: { ...state.index },
        skips: [...state.skips], // we assume that skips are not related to index
        duplicates: [],
        fileInfos: { ...state.fileInfos },
    };

    for (const path of Object.keys(indexUpdateInfo)) {
        const change = indexUpdateInfo[path];
        if (change.change === IndexChanges.Remove) {
            if (path in result.index) {
                delete result.index[path];
            }

            if (path in result.fileInfos) {
                delete result.fileInfos[path];
            }
        }
    }

    result.duplicates = new GraphAggregator(result.index).getResult();

    return result;
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
            let searchResult: ISearchResult;

            if (isOk(action.result)) {
                const ga = new GraphAggregator(action.result.index);
                searchResult = {
                    ...action.result,
                    duplicates: ga.getResult(),
                };
            }

            return {
                ...state,
                searchProcess: {
                    ...state.searchProcess,
                    inProgress: false,
                    progressRelative: 0,
                },
                searchResult,
                selectedConflictFiles: conflictFilesUpdate(state.selectedConflictFiles, searchResult),
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
                selectedConflictFiles: conflictFilesSelect(state, action.files, action.selected),
            };

        case Actions.CONFLICT_RESOLVER_SET_FILES_FILTER:
            return {
                ...state,
                filesFilter: action.filesFilter,
            };

        case Actions.CONFLICT_RESOLVER_SET_SEARCH_DIRECTORY:
            return {
                ...state,
                searchDirectory: action.searchDirectory,
            };

        case Actions.CONFLICT_RESOLVER_UPDATE_INDEX:
            const newSearchResult = indexUpdate(state.searchResult, action.indexUpdate);
            return {
                ...state,
                searchResult: newSearchResult,
                selectedConflictFiles: conflictFilesUpdate(state.selectedConflictFiles, newSearchResult),
            };

        default:
            return state;
    }
};
