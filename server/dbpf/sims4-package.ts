import { BasicDbpfIndex } from "./dbpf-index";
import { IDbpfHeader, IDbpfPackage, IDbpfRecord } from "./interfaces";
import { Sims4Header } from "./sims4-header";

export class Sims4Package implements IDbpfPackage {
    header: IDbpfHeader;
    records: IDbpfRecord[];

    constructor(buffer: Buffer) {
        this.header = new Sims4Header(buffer);
        const index = new BasicDbpfIndex(buffer, this.header);
        this.records = index.parseRecords(buffer);
    }
}
