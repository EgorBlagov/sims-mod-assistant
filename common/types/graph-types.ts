import { DoubleTypes, TKeyValue } from "./basic-types";

export interface IDuplicateGraphNode {
    path: string;
}

export type TFileValue = string;
export type TFileGroup = TFileValue[];

export interface IEdgeGroup {
    fileGroups: TFileGroup[];
    keys: TKeyValue[];
}

export interface IDuplicateGraph {
    edgeGroups: IEdgeGroup[];
    typeByKey: Record<TKeyValue, DoubleTypes>;
}

export interface IDuplicateGroupSummary {
    types: DoubleTypes[];
    files: TFileValue[];
}

export interface IDuplicateGroup {
    summary: IDuplicateGroupSummary;
    detailed: IDuplicateGraph;
}
