import { Sizes } from "./constants";
import { DbpfErrors, throwDbpfError } from "./errors";
import { IDbpfHeader } from "./interfaces";

export class Sims4Header implements IDbpfHeader {
    magic: string;
    major: number;
    minor: number;
    recordCount: number;
    indexSize: number;
    indexMinorVersion: number;
    indexOffset: number;

    constructor(buffer: Buffer) {
        this.magic = buffer.toString("ascii", 0, 4);
        this.major = buffer.readInt32LE(Sizes.Long);
        this.minor = buffer.readInt32LE(Sizes.Long * 2);
        this.recordCount = buffer.readInt32LE(Sizes.Long * 9);
        this.indexSize = buffer.readInt32LE(Sizes.Long * 11);
        this.indexMinorVersion = buffer.readInt32LE(Sizes.Long * 15);
        this.indexOffset = buffer.readInt32LE(Sizes.Long * 16);

        if (this.magic.toLowerCase() !== "dbpf") {
            throwDbpfError(DbpfErrors.NotDbpf);
        }

        if (this.major !== 2 || this.minor !== 1) {
            throwDbpfError(DbpfErrors.UnsupportedDbpfFormat);
        }
    }
}
