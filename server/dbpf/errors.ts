import { SkipReasons } from "../../common/types";

export enum DbpfErrors {
    NotDbpf = "NotDbpf",
    UnsupportedDbpfFormat = "UnsupportedDbpfFormat",
    UnknownError = "UnknownDbpfError",
}

export const DbpfToSkipReason: Record<DbpfErrors, SkipReasons> = {
    NotDbpf: SkipReasons.NotPackage,
    UnknownDbpfError: SkipReasons.UnableToParse,
    UnsupportedDbpfFormat: SkipReasons.UnsupportedSimsVersion,
};

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
