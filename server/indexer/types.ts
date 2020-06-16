import { DoubleTypes } from "../../common/types";
import { IFileClassifier } from "./classifiers/file-classifier";

export type TKeyType = string;

export type TFileKeyInfo = [TKeyType, string];
export type TFileKeys = TFileKeyInfo[];

export type TIndex = {
    [path: string]: TFileKeys;
};

export type TClassifiers = {
    [K in DoubleTypes]?: IFileClassifier;
};

export type TValidator = (filepath: string) => Promise<void | never>; // should raise if invalid
