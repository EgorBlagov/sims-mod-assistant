import * as _ from "lodash";
import { isOk } from "../../../common/tools";
import { IDbpfRecord, readDbpf } from "../../dbpf";
import { Types as DbpfResourceTypes } from "../../dbpf/constants";
import { IFileClassifier } from "./file-classifier";

export class DbpfClassifier implements IFileClassifier {
    async getKeys(path: string): Promise<string[]> {
        const dbpf = await readDbpf(path);

        const result: string[] = [];
        const dbpfCatalog = _.filter(dbpf.records, (r) => r.resourceType === DbpfResourceTypes.Catalog)[0];
        const dbpfDefinition = _.filter(dbpf.records, (r) => r.resourceType === DbpfResourceTypes.Definition)[0];
        const toTgi = (rec: IDbpfRecord): string => `${rec.resourceType}${rec.resourceGroup}${rec.instance}`;

        if (isOk(dbpfCatalog)) {
            result.push(toTgi(dbpfCatalog));
        }

        if (isOk(dbpfDefinition)) {
            result.push(toTgi(dbpfDefinition));
        }

        return result;
    }
}
