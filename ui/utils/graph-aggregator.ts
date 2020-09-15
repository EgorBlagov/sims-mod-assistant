import { TIndex } from "../../common/indexer/types";
import { DoubleTypes, IDuplicateGroup, IEdgeGroup, TFileValue, TKeyValue } from "../../common/types";

type TEncodeKey = string;
type TEncoded = Record<string, TEncodeKey>;
type TDecoded = Record<TEncodeKey, string>;
type TKeyTypes = Record<TKeyValue, DoubleTypes>;

type TEncodeFileGroup = TEncodeKey[];
type TSimilarFilesEntry = {
    keys: TEncodeKey[];
    files: TEncodeFileGroup;
};
type TByKeys = Record<TEncodeKey, TEncodeFileGroup[]>;
type TBySimilarFileGroupsEntry = {
    keys: TEncodeKey[];
    fileGroups: TEncodeFileGroup[];
};

type TNodeName = string;
type TGraphInfo = Record<TNodeName, TBySimilarFileGroupsEntry>;
type TGraph = Record<TNodeName, TNodeName[]>;

export class GraphAggregator {
    private result: IDuplicateGroup[];

    constructor(fileIndex: TIndex) {
        this.result = this.build(fileIndex);
    }

    public getResult() {
        return this.result;
    }

    private isSingleFile(fileGroups: TEncodeFileGroup[]) {
        let total = 0;
        for (const group of fileGroups) {
            total += group.length;
        }
        return total === 1;
    }

    private build(index) {
        const [encoded, decoded, keyTypes] = this.encodeFilesAndKeys(index);

        const bySimilarFiles = this.aggregateBySimilarFiles(index, encoded);
        const byKeys = this.removeUnconflicted(this.aggregateByKeys(bySimilarFiles));
        const byFileGroupsAndKeys = this.aggregateBySimilarFileGroups(byKeys);
        const [graph, infos] = this.buildGraph(byFileGroupsAndKeys);
        const graphGroups = this.splitIntoGroups(graph);
        const result: IDuplicateGroup[] = [];
        for (const group of graphGroups) {
            result.push(this.buildResultGroup(group, infos, decoded, keyTypes));
        }

        return result;
    }

    private toKey(arr: any[]): string {
        return arr.sort().join(",");
    }

    private aggregateBySimilarFiles(index: TIndex, encoded: TEncoded) {
        // aggregating files that share same sets of keys, to groups (each group will become single node)

        const result: Record<string, TSimilarFilesEntry> = {};
        for (const path of Object.keys(index)) {
            const keys = index[path].map((x) => encoded[x[1]]);
            const keysKey = this.toKey(keys);
            if (!(keysKey in result)) {
                result[keysKey] = {
                    keys,
                    files: [],
                };
            }

            result[keysKey].files.push(encoded[path]);
        }

        return Object.values(result);
    }

    private encodeFilesAndKeys(index): [TEncoded, TDecoded, TKeyTypes] {
        const encoded: TEncoded = {};
        const decoded: TDecoded = {};
        const keyTypes: TKeyTypes = {};

        let lastId = 0;
        const getCurrentId = (): TEncodeKey => `id${lastId}`;
        const nextId = (): TEncodeKey => {
            lastId++;
            return getCurrentId();
        };

        for (const path of Object.keys(index)) {
            encoded[path] = nextId();
            decoded[getCurrentId()] = path;
            for (const [keyType, key] of index[path]) {
                if (!(key in keyTypes)) {
                    keyTypes[key] = keyType;
                }
                encoded[key] = nextId();
                decoded[getCurrentId()] = key;
            }
        }

        return [encoded, decoded, keyTypes];
    }

    private aggregateByKeys(bySimilarFiles: TSimilarFilesEntry[]): TByKeys {
        // each Keys<-->FileGroup now split into individual
        // key1 - fileGroup1, key2 - fileGroup1 (for case [key1, key2] - fileGroup1)
        const result: TByKeys = {};
        for (const { keys, files } of bySimilarFiles) {
            for (const key of keys) {
                if (!(key in result)) {
                    result[key] = [];
                }

                result[key].push(files);
            }
        }

        return result;
    }

    private removeUnconflicted(byKeys: TByKeys): TByKeys {
        // remove keys where only one file shares it
        // filter non conflict
        const result = { ...byKeys };
        for (const key of Object.keys(result)) {
            if (this.isSingleFile(result[key])) {
                delete result[key];
            }
        }

        return result;
    }

    private aggregateBySimilarFileGroups(byKeys: TByKeys): TBySimilarFileGroupsEntry[] {
        // now we group keys
        // taking keys that share similar sets of files into single node (each keygroup that shares similar files will become single node)
        const result: Record<string, TBySimilarFileGroupsEntry> = {};
        for (const key of Object.keys(byKeys)) {
            const fileKey = this.toKey(byKeys[key].map((x) => `[${this.toKey(x)}]`));
            if (!(fileKey in result)) {
                result[fileKey] = {
                    fileGroups: byKeys[key],
                    keys: [],
                };
            }

            result[fileKey].keys.push(key);
        }

        return Object.values(result);
    }

    private buildGraph(byFiles: TBySimilarFileGroupsEntry[]): [TGraph, TGraphInfo] {
        const infos: TGraphInfo = {};
        const graph: TGraph = {};

        for (const { fileGroups, keys } of byFiles) {
            const keyGroupName = this.toKey(keys);

            if (!(keyGroupName in graph)) {
                graph[keyGroupName] = [];
            }

            infos[keyGroupName] = {
                fileGroups,
                keys,
            };

            for (const group of fileGroups) {
                const fileGroupName = this.toKey(group);

                if (!(fileGroupName in graph)) {
                    graph[fileGroupName] = [];
                }

                graph[fileGroupName].push(keyGroupName);
                graph[keyGroupName].push(fileGroupName);
            }
        }

        return [graph, infos];
    }

    private splitIntoGroups(graph: TGraph): TNodeName[][] {
        // walk through all the data and build graph
        // dfs through graph, to split it into separate unconnected graphs
        const visited: Set<TNodeName> = new Set();
        const graphGroups: TNodeName[][] = [];

        for (const nodeName of Object.keys(graph)) {
            if (!visited.has(nodeName)) {
                const newGroup: TNodeName[] = [];
                this.dfs(graph, nodeName, newGroup, visited);
                graphGroups.push(newGroup);
            }
        }

        return graphGroups;
    }

    private dfs(graph: TGraph, nodeName: TNodeName, currentGroup: TNodeName[], visited: Set<TNodeName>) {
        if (visited.has(nodeName)) {
            return;
        }

        currentGroup.push(nodeName);
        visited.add(nodeName);
        for (const neighbor of graph[nodeName]) {
            this.dfs(graph, neighbor, currentGroup, visited);
        }
    }

    private buildResultGroup(
        group: TNodeName[],
        infos: TGraphInfo,
        decoded: TDecoded,
        keyTypes: TKeyTypes,
    ): IDuplicateGroup {
        const result: IDuplicateGroup = {
            detailed: {
                edgeGroups: [],
                typeByKey: keyTypes,
            },
            summary: {
                files: [],
                types: [],
            },
        };

        const uniqueFiles: Set<TFileValue> = new Set();
        const uniqueTypes: Set<DoubleTypes> = new Set();

        for (const node of group) {
            if (node in infos) {
                const edgeGroup: IEdgeGroup = {
                    fileGroups: infos[node].fileGroups.map((gr) => gr.map((f) => decoded[f])),
                    keys: infos[node].keys.map((k) => decoded[k]),
                };
                edgeGroup.keys.forEach((k) => uniqueTypes.add(keyTypes[k]));
                edgeGroup.fileGroups.forEach((gr) => gr.forEach((f) => uniqueFiles.add(f)));
                result.detailed.edgeGroups.push(edgeGroup);
            }
        }

        result.summary.files = Array.from(uniqueFiles);
        result.summary.types = Array.from(uniqueTypes);
        return result;
    }
}
