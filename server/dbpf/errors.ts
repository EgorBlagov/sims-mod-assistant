export enum DbpfErrors {
    NotDbpf = "NotDbpf",
    UnsupportedDbpfFormat = "UnsupportedDbpfFormat",
    UnsupportedIndexType = "UnsupportedDbpfIndexType",
    UnknownError = "UnknownDbpfError",
}

export function throwDbpfError(type: DbpfErrors, msg?: string): never {
    const err = new Error(msg);
    err.name = type;
    throw err;
}

export function isDbpfError(err: Error): boolean {
    return Object.values(DbpfErrors)
        .map((x) => x.toString())
        .includes(err.name);
}
