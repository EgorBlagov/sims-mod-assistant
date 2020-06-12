import { Sizes } from "./constants";
import { IDbpfHeader, IDbpfIndex, IDbpfRecord } from "./interfaces";

const DbpfRecordPrototype = {
    resourceType: 0,
    resourceGroup: 0,
    instanceHi: 0,
    instanceLo: 0,
    offset: 0,
    packedSize: 0,
    memSize: 0,
    compressedReserved: 0,
};

type DbpfRecord = typeof DbpfRecordPrototype;
type DbpfRecordProp = keyof DbpfRecord;
const DbpfRecordProps: DbpfRecordProp[] = Object.keys(DbpfRecordPrototype) as DbpfRecordProp[];

type bit = 1 | 0;
export class DbpfIndex implements IDbpfIndex {
    private header: IDbpfHeader;
    private commonDataMask: [bit, bit, bit, bit, bit, bit, bit, bit];
    public records: IDbpfRecord[];
    private readPos: number;

    constructor(buffer: Buffer, header: IDbpfHeader) {
        this.header = header;
        this.commonDataMask = [0, 0, 0, 0, 0, 0, 0, 0];
        this.records = [];
        this.readPos = 0;

        this.parseCommonDataMask(buffer);
        this.parseRecords(buffer);
    }

    private parseCommonDataMask(buffer: Buffer) {
        const type = buffer.readInt32LE(0);

        for (let i = 0; i < 8; i++) {
            this.commonDataMask[i] = ((type & (1 << i)) >> i) as bit;
        }
        this.readPos += Sizes.Long;
    }

    private parseRecords(buffer: Buffer) {
        const commonData: DbpfRecord = { ...DbpfRecordPrototype };

        for (let i = 0; i < 8; i++) {
            if (this.commonDataMask[i]) {
                commonData[DbpfRecordProps[i]] = buffer.readUInt32LE(this.readPos);
                this.readPos += Sizes.Long;
            }
        }

        for (let i = 0; i < this.header.recordCount; i++) {
            const record: DbpfRecord = { ...commonData };
            for (let j = 0; j < 8; j++) {
                if (!this.commonDataMask[j]) {
                    record[DbpfRecordProps[j]] = buffer.readUInt32LE(this.readPos);
                    this.readPos += Sizes.Long;
                }
            }

            this.records.push(this.toRecord(record));
        }
    }

    private toRecord(record: DbpfRecord): IDbpfRecord {
        return {
            ...record,
            instance: (BigInt(record.instanceHi) << BigInt(32)) | BigInt(record.instanceLo),
            compressed: (record.compressedReserved >> (Sizes.Short * Sizes.BitsInByte)) & 0xffff,
            reserved: record.compressedReserved & 0xffff,
        };
    }
}
