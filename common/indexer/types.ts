import { IFileClassifier } from "../../server/indexer/classifiers/file-classifier";
import { DoubleTypes, TKeyValue } from "../types";

export type TFileKeyInfo = [DoubleTypes, TKeyValue];
export type TFileKeys = TFileKeyInfo[];

export type TIndex = {
    [path: string]: TFileKeys;
};

export type TClassifiers = {
    [K in DoubleTypes]?: IFileClassifier;
};

export type TValidator = (filepath: string) => Promise<void | never>; // should raise if invalid
