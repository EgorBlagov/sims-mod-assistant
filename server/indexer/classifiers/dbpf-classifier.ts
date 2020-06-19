import * as _ from "lodash";
import { TKeyValue } from "../../../common/types";
import { IDbpfRecord, readDbpf } from "../../dbpf";
import { DbpfResourceTypes } from "../../dbpf/constants";
import { IFileClassifier } from "./file-classifier";

export class DbpfClassifier implements IFileClassifier {
    private resourceTypes: DbpfResourceTypes[];

    public constructor(types: DbpfResourceTypes[]) {
        this.resourceTypes = types;
    }

    async getKeys(path: string): Promise<TKeyValue[]> {
        const dbpf = await readDbpf(path);
        const toTgi = (rec: IDbpfRecord): string =>
            `${rec.resourceType.toString(16).padStart(8, "0")}-${rec.resourceGroup
                .toString(16)
                .padStart(8, "0")}-${rec.instance.toString(16).padStart(16, "0")}`;

        return _(dbpf.records)
            .filter((r) => this.resourceTypes.includes(r.resourceType))
            .map(toTgi)
            .value();
    }
}
