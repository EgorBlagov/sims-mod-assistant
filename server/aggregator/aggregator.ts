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

export class Aggregator {
    private index: TIndex;
    private reversed: TReversedIndex;
    private fullGraph: TFullGraph;

    constructor(fileIndex: TIndex) {
        this.index = fileIndex;
        this.buildReverseIndex();
        this.buildFullGraph();
        this.defineClasters();
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

    private defineClasters() {
        const dfs = (path: string, group: number) => {
            this.fullGraph[path].group = group;

            for (const neighbor of Object.keys(this.fullGraph[path].neighbors)) {
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
        throw new Error("Method not implemented.");
    }
}
