import * as _ from "lodash";
import * as path from "path";
import { DoubleTypes, IFileDuplicate, ISearchResult, ISkippedFile, SkipReasons } from "../../common/types";
import { DbpfErrors, DbpfToSkipReason, isDbpfError } from "../dbpf/errors";
import { logger } from "../logging";
import { IFileWithStats } from "../types";
import { IFileClassifier } from "./classifiers/file-classifier";

type TKeyType = string;
type TCopyTree = {
    [tKeyType: string]: {
        [keyValue: string]: IFileWithStats[];
    };
};

type TFileKeyInfo = [TKeyType, string];
type TFileKeys = TFileKeyInfo[];
type TClassifiers = {
    [tKeyType: string]: {
        getter: IFileClassifier;
        type: DoubleTypes;
    };
};

type TDuplicates = Record<
    string,
    {
        duplicate: IFileWithStats;
        collisions: TKeyType[];
    }
>;
type TAggregatedFileEntry = {
    original: IFileWithStats;
    duplicates: TDuplicates;
};
type TAggregatedByOriginals = Record<string, TAggregatedFileEntry>;

type TValidator = (file: IFileWithStats) => Promise<void | never>; // should raise if invalid

export class Analyzer {
    private copyTree: TCopyTree;
    private skips: ISkippedFile[];
    private classifiers: TClassifiers;
    private validator: TValidator;

    constructor() {
        this.skips = [];
        this.copyTree = {};
        this.classifiers = {};
        this.validator = () => null;
    }

    public setClassifier(key: TKeyType, classifier: IFileClassifier, doubleType: DoubleTypes): void {
        this.classifiers[key] = {
            getter: classifier,
            type: doubleType,
        };
    }

    public setValidator(validator: TValidator) {
        this.validator = validator;
    }

    public async pushFile(file: IFileWithStats): Promise<void> {
        try {
            await this.validator(file);
            const keys = await this.getFileKeys(file);
            for (const [keyType, keyValue] of keys) {
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
        return this.aggregateResult(this.aggregateByOriginals());
    }

    private aggregateByOriginals() {
        const duplicatesMap: TAggregatedByOriginals = {};

        for (const keyType of Object.keys(this.copyTree)) {
            for (const keyValue of Object.keys(this.copyTree[keyType])) {
                const similars = this.copyTree[keyType][keyValue];
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
                                collisions: [],
                            };

                            const currentDuplicateInfo = currentDuplicates[duplicate.path.toString()];
                            currentDuplicateInfo.collisions.push(keyType);
                        }
                    }
                }
            }
        }

        return duplicatesMap;
    }

    private aggregateResult(duplicatesMap: TAggregatedByOriginals): ISearchResult {
        const result: ISearchResult = {
            duplicates: [],
            skips: this.skips,
        };

        for (const origPath of Object.keys(duplicatesMap)) {
            const origEntry = duplicatesMap[origPath];
            const duplicates: IFileDuplicate[] = this.duplicatesToList(origEntry);

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

    private duplicatesToList(fileEntry: TAggregatedFileEntry) {
        return _.map(fileEntry.duplicates, (d) => {
            return {
                basename: path.basename(d.duplicate.path.toString()),
                path: d.duplicate.path.toString(),
                date: d.duplicate.stats.mtime,
                duplicateChecks: {
                    Catalog: d.collisions.map((x) => this.classifiers[x].type).includes(DoubleTypes.Catalog),
                    Exact: d.collisions.map((x) => this.classifiers[x].type).includes(DoubleTypes.Exact),
                },
            };
        });
    }

    private async getFileKeys(file: IFileWithStats): Promise<TFileKeys> {
        const result: TFileKeys = [];

        for (const keyType of Object.keys(this.classifiers)) {
            const fileKeys = await this.classifiers[keyType].getter.getKeys(file.path.toString());
            const keysWithTypes: TFileKeyInfo[] = _.map(fileKeys, (k) => [keyType, k]);
            result.push(...keysWithTypes);
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
