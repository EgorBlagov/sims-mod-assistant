export interface IDbpfHeader {
    magic: string;
    major: number;
    minor: number;
    recordCount: number;
    indexSize: number;
    indexMinorVersion: number;
    indexOffset: number;
}

export interface IDbpfRecord {
    resourceType: number;
    resourceGroup: number;
    instance: bigint;
    offset: number;
    packedSize: number;
    memSize: number;
    compressed: number;
    reserved: number;
}

export interface IDbpfPackage {
    header: IDbpfHeader;
    records: IDbpfRecord[];
}

export interface IDbpfIndex {
    records: IDbpfRecord[];
}
