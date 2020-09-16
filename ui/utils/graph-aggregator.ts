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
    /*
        the class created to analyze index, split files to independent groups,
        group files with similar keys, and create summary of each group to simplify usage outside

    */
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
        /*
            Let's say your index looks this way:
            file1: [key1, key2, key3]
            file2: [key1, key2, key3]
            file3: [key3]
            file4: [key4]
            file5: [key4]

            file1+-------+key1+-------+file2       file4
                 |                    |              +
                 +-------+key2+-------+              |
                 |                    |              +
                 +-------+key3+-------+            key4
                            +                        +
                            |                        |
                            +                        +
                          file3                    file5
        */

        /*
            Here we replace filenames and keys with simple names
            (js doesn't support tuple usage as key, so we collapse complex names, to use names.join(', ')
            as key)
            id1: [id6, id7, id8]
            id2: [id6, id7, id8]
            id3: [id8]
            id4: [id9]
            id5: [id9]

            id1+-------+id6+--------+id2          id4
               |                    |              +
               +-------+id7+--------+              |
               |                    |              +
               +-------+id8+--------+             id9
                          +                        +
                          |                        |
                          +                        +
                         id3                      id5
        */
        const [encoded, decoded, keyTypes] = this.encodeFilesAndKeys(index);

        /*
            Here we group files with similar keys
            [id1, id2] - [id6, id7, id8]
            id3 - [id8]
            [id4, id5] - [id9]

            [id1, id2]+-------+id6    [id4, id5]
                      |                   +
                      +-------+id7        |
                      |                   +
                      +-------+id8       id9
                                +
                                |
                                +
                               id3
        */
        const bySimilarFiles = this.aggregateBySimilarFiles(index, encoded);

        /*
            Creating reversed data, key <-> files and fileGroups
            id6: [id1, id2]
            id7: [id1, id2]
            id8: [id1, id2], id3
            id9: [id4, id5]

            also remove keys that have only single file (those files do not conflict with anything)
        */
        const byKeys = this.removeUnconflicted(this.aggregateByKeys(bySimilarFiles));

        /*
            group by keys that share similar file groups
            [id6, id7]: [id1, id2]
            id8: [id1, id2], id3
            id9: [id4, id5]

            [id1, id2]+-------+[id6, id7]  [id4, id5]
                      |                        +
                      |                        |
                      +-------+id8             +
                                +             id9
                                |
                                +
                               id3
        */
        const byFileGroupsAndKeys = this.aggregateBySimilarFileGroups(byKeys);

        /*
            build the graph itself, and save infos ([id1, id2] was list, now it's key 'id1,id2',
            but the data must be saved)
            graph:
            'id6,id7: 'id1,id2',
            'id8': 'id1,id2', 'id3',
            'id9': 'id4,id5',
            'id3': 'id8',
            'id1,id2': 'id6,id7', 'id8',
            'id4,id5': 'id9',
        */
        const [graph, infos] = this.buildGraph(byFileGroupsAndKeys);

        /* 
            dfs through graphs, and distinguish each component
            one component is a group of files that conflict with each other
        */
        const graphGroups = this.splitIntoGroups(graph);
        const result: IDuplicateGroup[] = [];

        // decode all the filenames, key values, types and write as list of groups
        for (const group of graphGroups) {
            result.push(this.buildResultGroup(group, infos, decoded, keyTypes));
        }

        return result;
    }

    private toKey(arr: any[]): string {
        return arr.sort().join(",");
    }

    private aggregateBySimilarFiles(index: TIndex, encoded: TEncoded) {
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
        const result = { ...byKeys };
        for (const key of Object.keys(result)) {
            if (this.isSingleFile(result[key])) {
                delete result[key];
            }
        }

        return result;
    }

    private aggregateBySimilarFileGroups(byKeys: TByKeys): TBySimilarFileGroupsEntry[] {
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
