import * as fs from "fs";

export interface IFileWithStats {
    path: fs.PathLike;
    stats: fs.Stats;
}
