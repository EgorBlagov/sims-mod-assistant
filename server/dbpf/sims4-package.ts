import { promises } from "fs";
import { DbpfIndex } from "./dbpf-index";
import { IDbpfHeader, IDbpfPackage, IDbpfRecord } from "./interfaces";
import { DBPF_HEADER_SIZE, Sims4Header } from "./sims4-header";

export class Sims4Package implements IDbpfPackage {
    header: IDbpfHeader;
    records: IDbpfRecord[];

    private constructor(header: IDbpfHeader, records: IDbpfRecord[]) {
        this.header = header;
        this.records = records;
    }

    public static async read(file: promises.FileHandle) {
        const header = await Sims4Package.readHeader(file);
        const records = await Sims4Package.parseRecords(header, file);
        return new Sims4Package(header, records);
    }

    private static async readHeader(file: promises.FileHandle): Promise<IDbpfHeader> {
        const headerBuffer = Buffer.alloc(DBPF_HEADER_SIZE);
        await file.read(headerBuffer, 0, headerBuffer.length);
        return new Sims4Header(headerBuffer);
    }

    private static async parseRecords(header: IDbpfHeader, file: promises.FileHandle): Promise<IDbpfRecord[]> {
        const indexBuffer = Buffer.alloc(header.indexSize);
        await file.read(indexBuffer, 0, indexBuffer.length, header.indexOffset);
        const index = new DbpfIndex(indexBuffer, header);
        return index.records;
    }
}
