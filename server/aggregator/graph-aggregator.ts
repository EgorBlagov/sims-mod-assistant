import { DoubleTypes } from "../../common/types";
import { TIndex, TKeyValue } from "../indexer/types";
import { IDuplicateGroup } from "./types";

type TReversedIndex = {
    [keyValue: string]: string[]; // keyValue: TKeyValue
};

type TNeighbors = {
    [neighbor: string]: {
        keys: TKeyValue[];
        types: Set<DoubleTypes>;
    };
};

type TFullGraph = {
    [path: string]: TNeighbors;
};

export class GraphBuilder {
    private index: TIndex;
    private reversed: TReversedIndex;
    private fullGraph: TFullGraph;
    private resultDuplicateGroups: IDuplicateGroup[];

    constructor(fileIndex: TIndex) {
        this.index = fileIndex;
        this.buildReverseIndex();
        this.buildFullGraph();
        this.buildGroupsAndSummaries();
    }

    public get result(): IDuplicateGroup[] {
        return this.resultDuplicateGroups;
    }

    private buildReverseIndex() {
        this.reversed = {};

        for (const path of Object.keys(this.index)) {
            for (const [_, keyValue] of this.index[path]) {
                if (!(keyValue in this.reversed)) {
                    this.reversed[keyValue] = [];
                }

                this.reversed[keyValue].push(path);
            }
        }
    }

    private buildFullGraph() {
        this.fullGraph = {};

        for (const path of Object.keys(this.index)) {
            const currentNeighbors: TNeighbors = {};
            for (const [keyType, keyValue] of this.index[path]) {
                for (const neighbor of this.reversed[keyValue]) {
                    if (neighbor === path) {
                        continue;
                    }

                    if (!(neighbor in currentNeighbors)) {
                        currentNeighbors[neighbor] = {
                            keys: [],
                            types: new Set(),
                        };
                    }

                    currentNeighbors[neighbor].keys.push(keyValue);
                    currentNeighbors[neighbor].types.add(keyType);
                }
            }

            if (Object.keys(currentNeighbors).length !== 0) {
                // We ignore files with no conflicting keys
                this.fullGraph[path] = currentNeighbors;
            }
        }
    }

    private buildGroupsAndSummaries() {
        this.resultDuplicateGroups = [];
        const visited = new Set<string>();
        const visitedLinks = new Set<[string, string]>();

        const dfs = (path: string, group: number) => {
            const currentGroup = this.resultDuplicateGroups[group];
            currentGroup.detailed.nodes.push({
                path,
            });
            visited.add(path);

            for (const neighbor of Object.keys(this.fullGraph[path])) {
                const linkKey = this.getLinkKey(name, neighbor);
                if (!visitedLinks.has(linkKey)) {
                    visitedLinks.add(linkKey);
                    currentGroup.detailed.links.push({
                        source: path,
                        target: neighbor,
                        keys: this.fullGraph[path][neighbor].keys,
                        types: Array.from(this.fullGraph[path][neighbor].types),
                    });
                }

                this.fullGraph[path][neighbor].types.forEach((t) => {
                    if (!currentGroup.types.includes(t)) {
                        currentGroup.types.push(t);
                    }
                });

                if (visited.has(neighbor)) {
                    continue;
                }

                dfs(neighbor, group);
            }
        };

        let groupId = 0;
        for (const path of Object.keys(this.fullGraph)) {
            if (!visited.has(path)) {
                this.resultDuplicateGroups.push({
                    types: [],
                    detailed: {
                        links: [],
                        nodes: [],
                    },
                });

                dfs(path, groupId);
                groupId++;
            }
        }
    }

    private getLinkKey(path: string, neighbor: string): [string, string] {
        return path <= neighbor ? [path, neighbor] : [neighbor, path];
    }
}
