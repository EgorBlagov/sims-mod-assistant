import * as _ from "lodash";
import { DoubleTypes, ISkippedFile, SkipReasons } from "../../common/types";
import { DbpfErrors, DbpfToSkipReason, isDbpfError } from "../dbpf/errors";
import { IFileClassifier } from "./classifiers/file-classifier";
import { TClassifiers, TFileKeys, TIndex, TKeyType, TValidator } from "./types";

export class Analyzer {
    private skips: ISkippedFile[];
    private classifiers: TClassifiers;
    private validator: TValidator;
    private index: TIndex;

    constructor() {
        this.skips = [];
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

        for (const keyType of Object.keys(this.classifiers)) {
            const fileKeys = await this.classifiers[keyType].getter.getKeys(filepath);
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
