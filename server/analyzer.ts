import * as _ from "lodash";
import * as path from "path";
import { isOk } from "../common/tools";
import { IFileDuplicate, ISearchParams, ISearchResult, ISkippedFile, SkipReasons } from "../common/types";
import { IDbpfRecord, readDbpf } from "./dbpf";
import { DbpfErrors, DbpfToSkipReason, isDbpfError } from "./dbpf/errors";
import { logger } from "./logging";
import { md5 } from "./md5";
import { IFileWithStats } from "./types";

enum KeyTypes {
    TgiCatalog = "TgiCatalog",
    TgiDefinition = "TgiDefinition",
    Md5Hash = "Md5Hash",
}

type TCopyTree = {
    [K in KeyTypes]?: {
        [x: string]: IFileWithStats[];
    };
};

type TFileKeys = {
    [K in KeyTypes]?: string;
};

export class Analyzer {
    private params: ISearchParams;

    private copyTree: TCopyTree;
    private skips: ISkippedFile[];

    constructor(params: ISearchParams) {
        this.params = params;
        this.skips = [];
        this.copyTree = {};
    }

    public async pushFile(file: IFileWithStats): Promise<void> {
        try {
            const keys = await this.getFileKeys(file);

            for (const key of Object.keys(keys)) {
                const keyType = key as KeyTypes;
                const keyValue = keys[keyType];
                if (!(keyType in this.copyTree)) {
                    this.copyTree[keyType] = {};
                }

                if (!(keyValue in this.copyTree[keyType])) {
                    this.copyTree[keyType][keyValue] = [];
                }

                const sameKey: IFileWithStats[] = this.copyTree[keyType][keyValue];

                if (sameKey.length > 0 && file.stats.mtime > sameKey[0].stats.mtime) {
                    // first element will be the newest
                    sameKey.unshift(file);
                } else {
                    sameKey.push(file);
                }
            }
        } catch (error) {
            logger.warn(`Skip: ${path.basename(file.path.toString())}: ${error.name}`);
            this.summary.skips.push({
                basename: path.basename(file.path.toString()),
                date: file.stats.mtime,
                path: file.path.toString(),
                reason: this.getReason(error),
            });
        }
    }

    public get summary(): ISearchResult {
        const result: ISearchResult = {
            duplicates: [],
            skips: this.skips,
        };

        const duplicatesMap: Record<
            string,
            {
                original: IFileWithStats;
                duplicates: Record<
                    string,
                    {
                        duplicate: IFileWithStats;
                        criterias: KeyTypes[];
                    }
                >;
            }
        > = {};

        for (const keyType of Object.keys(this.copyTree)) {
            for (const keyValue of Object.keys(this.copyTree[keyType as KeyTypes])) {
                const similars = this.copyTree[keyType as KeyTypes][keyValue];
                const original = similars[0];
                const duplicates = similars.slice(1);
                if (duplicates.length > 0) {
                    if (!(original.path in duplicatesMap)) {
                        duplicatesMap[original.path.toString()] = {
                            original,
                            duplicates: {},
                        };
                    }
                    const currentDuplicates = duplicatesMap[original.path.toString()].duplicates;
                    for (const duplicate of duplicates) {
                        if (!(duplicate.path.toString() in currentDuplicates)) {
                            currentDuplicates[duplicate.path.toString()] = {
                                duplicate,
                                criterias: [],
                            };

                            const currentDuplicateInfo = currentDuplicates[duplicate.path.toString()];
                            currentDuplicateInfo.criterias.push(keyType as KeyTypes);
                        }
                    }
                }
            }
        }

        for (const origPath of Object.keys(duplicatesMap)) {
            const origEntry = duplicatesMap[origPath];
            const duplicates: IFileDuplicate[] = [];
            for (const duplicatePath of Object.keys(origEntry.duplicates)) {
                const duplicate = origEntry.duplicates[duplicatePath];
                duplicates.push({
                    basename: path.basename(duplicate.duplicate.path.toString()),
                    path: duplicate.duplicate.path.toString(),
                    date: duplicate.duplicate.stats.mtime,
                    duplicateChecks: {
                        Catalog:
                            duplicate.criterias.includes(KeyTypes.TgiCatalog) ||
                            duplicate.criterias.includes(KeyTypes.TgiDefinition),
                        Exact: duplicate.criterias.includes(KeyTypes.Md5Hash),
                    },
                });
            }

            result.duplicates.push({
                original: {
                    basename: path.basename(origEntry.original.path.toString()),
                    path: origEntry.original.path.toString(),
                    date: origEntry.original.stats.mtime,
                },
                duplicates,
            });
        }

        return result;
    }

    private async getFileKeys(file: IFileWithStats): Promise<TFileKeys> {
        const dbpf = await readDbpf(file.path.toString());

        const dbpfCatalog = _.filter(dbpf.records, (r) => r.resourceType === 0x319e4f1d)[0];
        const dbpfDefinition = _.filter(dbpf.records, (r) => r.resourceType === 0xc0db5ae7)[0];
        const toTgi = (rec: IDbpfRecord): string => `${rec.resourceType}${rec.resourceGroup}${rec.instance}`;

        const result: TFileKeys = {};

        if (this.params.searchMd5) {
            result.Md5Hash = await md5(file.path.toString());
        }

        if (this.params.searchTgi) {
            if (isOk(dbpfCatalog)) {
                result.TgiCatalog = toTgi(dbpfCatalog);
            }

            if (isOk(dbpfDefinition)) {
                result.TgiDefinition = toTgi(dbpfDefinition);
            }
        }

        return result;
    }

    private getReason(err: Error): SkipReasons {
        if (isDbpfError(err)) {
            return DbpfToSkipReason[err.name as DbpfErrors];
        }

        return SkipReasons.UnableToParse;
    }
}
