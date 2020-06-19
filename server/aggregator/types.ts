import { DoubleTypes } from "../../common/types";
import { TKeyValue } from "../indexer/types";

export interface IDuplicateGraphNode {
    path: string;
}

export interface IDuplicateGraphLink {
    source: string;
    target: string;
    keys: TKeyValue[];
    types: DoubleTypes[];
}

export interface IDuplicateGraph {
    nodes: IDuplicateGraphNode[];
    links: IDuplicateGraphLink[];
}

export interface IDuplicateGroup {
    types: DoubleTypes[];
    detailed: IDuplicateGraph;
}
