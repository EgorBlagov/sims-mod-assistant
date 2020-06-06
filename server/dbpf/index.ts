import * as fs from "fs";
import { DbpfErrors, isDbpfError, throwDbpfError } from "./errors";
import { IDbpfPackage } from "./interfaces";
import { Sims4Package } from "./sims4-package";

export async function readDbpf(path: string): Promise<IDbpfPackage> {
    try {
        const file = await fs.promises.readFile(path);
        return new Sims4Package(file);
    } catch (err) {
        if (!isDbpfError(err)) {
            throwDbpfError(DbpfErrors.UnknownError, err.message);
        }
        throw err;
    }
}

export * from "./interfaces";
