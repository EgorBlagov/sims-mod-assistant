import { TKeyValue } from "../types";

export interface IFileClassifier {
    getKeys(path: string): Promise<TKeyValue[]>;
}
