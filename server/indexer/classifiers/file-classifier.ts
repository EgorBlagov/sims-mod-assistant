export interface IFileClassifier {
    getKeys(path: string): Promise<string[]>;
}
