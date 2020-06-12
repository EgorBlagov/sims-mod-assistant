import * as _ from "lodash";
import { IDbpfRecord, readDbpf } from "../../dbpf";
import { DbpfResourceTypes } from "../../dbpf/constants";
import { IFileClassifier } from "./file-classifier";

export class DbpfClassifier implements IFileClassifier {
    async getKeys(path: string): Promise<string[]> {
        const dbpf = await readDbpf(path);
        const toTgi = (rec: IDbpfRecord): string => `${rec.resourceType}${rec.resourceGroup}${rec.instance}`;
        const typesToCheck = [DbpfResourceTypes.Catalog, DbpfResourceTypes.Definition];
        return _(dbpf.records)
            .filter((r) => typesToCheck.includes(r.resourceType))
            .map(toTgi)
            .value();
    }
}
