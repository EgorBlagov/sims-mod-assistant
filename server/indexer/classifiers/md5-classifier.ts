import { md5 } from "../../md5";
import { TKeyValue } from "../types";
import { IFileClassifier } from "./file-classifier";

export class Md5Classifier implements IFileClassifier {
    async getKeys(path: string): Promise<TKeyValue[]> {
        const md5Hash = await md5(path);
        return [md5Hash];
    }
}
