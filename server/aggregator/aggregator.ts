import { DoubleTypes } from "../../common/types";
import { TIndex, TKeyValue } from "../indexer/types";

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
    [path: string]: {
        neighbors: TNeighbors;
        group: number;
    };
};

type TSummaryDoubleType = {
    [group: number]: Set<DoubleTypes>;
};

interface IResultGraphNode {
    id: string;
    group: number;
}

interface IResultGraphLink {
    source: string;
    target: string;
    keys: TKeyValue[];
    types: DoubleTypes[];
}

interface IResultGraph {
    nodes: IResultGraphNode[];
    links: IResultGraphLink[];
}

export class Aggregator {
    private index: TIndex;
    private reversed: TReversedIndex;
    private fullGraph: TFullGraph;
    private summaryDoubleType: TSummaryDoubleType;
    private resultGraph: IResultGraph;

    constructor(fileIndex: TIndex) {
        this.index = fileIndex;
        this.buildReverseIndex();
        this.buildFullGraph();
        this.buildGroupsAndSummaries();
        this.buildEndGraph();
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
                this.fullGraph[path] = {
                    group: -1,
                    neighbors: currentNeighbors,
                };
            }
        }
    }

    private buildGroupsAndSummaries() {
        this.summaryDoubleType = {};

        const dfs = (path: string, group: number) => {
            this.fullGraph[path].group = group;

            if (!(group in this.summaryDoubleType)) {
                this.summaryDoubleType[group] = new Set();
            }

            for (const neighbor of Object.keys(this.fullGraph[path].neighbors)) {
                this.fullGraph[path].neighbors[neighbor].types.forEach((t) => {
                    this.summaryDoubleType[group].add(t);
                });

                if (this.fullGraph[neighbor].group !== -1) {
                    continue;
                }

                dfs(neighbor, group);
            }
        };

        let groupId = 0;
        for (const path of Object.keys(this.fullGraph)) {
            if (this.fullGraph[path].group === -1) {
                dfs(path, groupId);
                groupId++;
            }
        }
    }

    private buildEndGraph() {
        this.resultGraph = { links: [], nodes: [] };
        const addedLinks = new Set<[string, string]>();
        for (const path of Object.keys(this.fullGraph)) {
            this.resultGraph.nodes.push({
                id: path,
                group: this.fullGraph[path].group,
            });

            for (const neighbor of Object.keys(this.fullGraph[path].neighbors)) {
                const linkKey = this.getLinkKey(path, neighbor);
                if (!addedLinks.has(linkKey)) {
                    addedLinks.add(linkKey);
                    this.resultGraph.links.push({
                        source: path,
                        target: neighbor,
                        keys: this.fullGraph[path].neighbors[neighbor].keys,
                        types: Array.from(this.fullGraph[path].neighbors[neighbor].types),
                    });
                }
            }
        }
    }

    private getLinkKey(path: string, neighbor: string): [string, string] {
        return path <= neighbor ? [path, neighbor] : [neighbor, path];
    }
}
