export class DefaultDict<T extends string | number, K extends any> {
    private valueFactory: () => K;
    private dict: Record<T, K>;

    constructor(valueFactory: () => K) {
        this.valueFactory = valueFactory;
    }

    public get(key: T): K {
        if (!(key in this.dict)) {
            this.dict[key] = this.valueFactory();
        }

        return this.dict[key];
    }

    public set(key: T, value: K): void {
        this.dict[key] = value;
    }

    public keys(): string[] {
        return Object.keys(this.dict);
    }
}
