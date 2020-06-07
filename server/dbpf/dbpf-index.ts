import * as _ from "lodash";
import { Sizes } from "./constants";
import { DbpfErrors, throwDbpfError } from "./errors";
import { IDbpfHeader, IDbpfIndex, IDbpfRecord } from "./interfaces";

export class BasicDbpfIndex implements IDbpfIndex {
    private type: number;
    private header: IDbpfHeader;
    public records: IDbpfRecord[];

    constructor(buffer: Buffer, header: IDbpfHeader) {
        this.header = header;
        this.type = buffer.readInt32LE(this.indexOffset);

        if (this.type !== 0) {
            // We only support this index type
            // hence common data size is always 0 and index item size is always 32
            throwDbpfError(DbpfErrors.UnsupportedIndexType);
        }

        this.records = this.parseRecords(buffer);
    }

    private get indexOffset() {
        return 0;
    }

    public parseRecords(buffer: Buffer): IDbpfRecord[] {
        const result: IDbpfRecord[] = [];

        for (let i = 0; i < this.header.recordCount; i++) {
            result.push(
                this.parseRecord(buffer, this.indexOffset + Sizes.Long + this.commonDataSize + i * this.itemSize),
            );
        }

        return result;
    }

    private parseRecord(buffer: Buffer, offset: number): IDbpfRecord {
        return {
            resourceType: buffer.readUInt32LE(offset),
            resourceGroup: buffer.readUInt32LE(offset + Sizes.Long),
            instance:
                (BigInt(buffer.readUInt32LE(offset + Sizes.Long * 2)) << BigInt(32)) |
                BigInt(buffer.readUInt32LE(offset + Sizes.Long * 3)),
            offset: buffer.readUInt32LE(offset + Sizes.Long * 4),
            packedSize: buffer.readUInt32LE(offset + Sizes.Long * 5),
            memSize: buffer.readUInt32LE(offset + Sizes.Long * 6),
            compressed: buffer.readInt16LE(offset + Sizes.Long * 7),
            reserved: buffer.readInt16LE(offset + Sizes.Long * 7 + Sizes.Short),
        };
    }

    private get typeBits(): number {
        return _.filter(this.type.toString(2), (x) => x === "1").length;
    }

    private get commonDataSize(): number {
        return this.typeBits * 4;
    }

    private get itemSize(): number {
        return 4 * (8 - this.typeBits);
    }
}
