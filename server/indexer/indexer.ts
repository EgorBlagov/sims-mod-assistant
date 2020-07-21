import * as _ from "lodash";
import { TClassifiers, TFileKeys, TIndex, TValidator } from "../../common/indexer/types";
import { DoubleTypes, ISkippedFile, SkipReasons } from "../../common/types";
import { DbpfErrors, DbpfToSkipReason, isDbpfError } from "../dbpf/errors";
import { IFileClassifier } from "./classifiers/file-classifier";

export class Indexer {
    private skips: ISkippedFile[];
    private classifiers: TClassifiers;
    private validator: TValidator;
    private index: TIndex;

    constructor() {
        this.skips = [];
        this.index = {};
        this.classifiers = {};
        this.validator = () => null;
    }

    public getIndex() {
        return this.index;
    }

    public getSkips() {
        return this.skips;
    }

    public setClassifier(doubleType: DoubleTypes, classifier: IFileClassifier): void {
        this.classifiers[doubleType] = classifier;
    }

    public setValidator(validator: TValidator) {
        this.validator = validator;
    }

    public async pushFile(filepath: string): Promise<void> {
        try {
            await this.validator(filepath);
            const keys = await this.getFileKeys(filepath);
            this.index[filepath] = keys;
        } catch (error) {
            this.skips.push({
                path: filepath,
                reason: this.getReason(error),
            });
        }
    }

    private async getFileKeys(filepath: string): Promise<TFileKeys> {
        const result: TFileKeys = [];

        for (const classifierKey of Object.keys(this.classifiers)) {
            const keyType: DoubleTypes = classifierKey as DoubleTypes;
            const fileKeys = await this.classifiers[keyType].getKeys(filepath);
            const keysWithTypes: TFileKeys = _.map(fileKeys, (k) => [keyType, k]);
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
