import * as fs from "fs";
import { isOk } from "../../common/tools";
import { DbpfErrors, isDbpfError, throwDbpfError } from "./errors";
import { IDbpfPackage } from "./interfaces";
import { Sims4Package } from "./sims4-package";

export async function readDbpf(path: string): Promise<IDbpfPackage> {
    let fh: fs.promises.FileHandle;
    try {
        fh = await fs.promises.open(path, "r");
        return await Sims4Package.read(fh);
    } catch (err) {
        if (!isDbpfError(err)) {
            throwDbpfError(DbpfErrors.UnknownError, err.message);
        }
        throw err;
    } finally {
        if (isOk(fh)) {
            await fh.close();
        }
    }
}

export * from "./interfaces";
