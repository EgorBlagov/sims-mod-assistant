import * as path from "path";
import { ISearchParams, ISearchResult, SkipReasons } from "../common/types";
import { DbpfErrors, DbpfToSkipReason, isDbpfError } from "./dbpf/errors";
import { IFileWithStats } from "./types";

export class Analyzer {
    private params: ISearchParams;

    private uniques: any; // Not Implemented;

    constructor(params: ISearchParams) {
        this.params = params;
    }

    public async pushFile(file: IFileWithStats): Promise<void> {
        try {
            const keys = await this.getFileKeys(file);

            for (const keyType of Object.keys(keys)) {
                const keyValue = keys[keyType];
                const sameKey: IFileWithStats[] = this.uniques[keyType][keyValue];

                if (sameKey.length > 0 && file.stats.mtime > sameKey[0].stats.mtime) {
                    // 0 element will be the newest
                    sameKey.unshift(file);
                } else {
                    sameKey.push(file);
                }
            }
        } catch (err) {
            this.summary.skips.push({
                basename: path.basename(file.path.toString()),
                date: file.stats.mtime,
                path: file.path.toString(),
                reason: this.getReason(err),
            });
        }
    }

    public get summary(): ISearchResult {
        throw new Error("Not implemented");
    }

    private getFileKeys(file: IFileWithStats): any {
        throw new Error("Not Implemented");
    }

    private getReason(err: Error): SkipReasons {
        if (isDbpfError(err)) {
            return DbpfToSkipReason[err.name as DbpfErrors];
        }

        return SkipReasons.UnableToParse;
    }
}
