import * as fs from "fs";

export interface IFileWithStats {
    path: string;
    stats: fs.Stats;
}
