import { TKeyValue } from "../../../common/types";

export interface IFileClassifier {
    getKeys(path: string): Promise<TKeyValue[]>;
}
