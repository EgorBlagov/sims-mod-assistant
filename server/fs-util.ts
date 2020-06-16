import * as fs from "fs";
import * as path from "path";
import { IDirectoryInfo } from "../common/types";
import { IFileWithStats } from "./types";

export enum FileSizes {
    MB = 1024 * 1024,
}

export async function getAllFilesInDirectory(targetPath: string, recursive: boolean = true): Promise<fs.PathLike[]> {
    const result: fs.PathLike[] = [];
    const contents = await fs.promises.readdir(targetPath, { withFileTypes: true });
    for (const entry of contents) {
        const entryPath = path.join(targetPath, entry.name);
        if (entry.isDirectory() && recursive) {
            const innerFiles = await this.getAllFilesInDirectory(entryPath);
            result.push(...innerFiles);
        } else {
            result.push(entryPath);
        }
    }

    return result;
}

export async function getDirectoryInfo(targetPath: string): Promise<IDirectoryInfo> {
    const allFiles = await this.getFilesAllWithStats(targetPath);
    return {
        filesCount: allFiles.length,
        sizeMb: _.reduce(allFiles, (sum, file) => sum + file.stats.size / FileSizes.MB, 0),
    };
}

export async function getFilesAllWithStats(targetPath: string): Promise<IFileWithStats[]> {
    const allFiles = await getAllFilesInDirectory(targetPath);
    return Promise.all(
        _.map(allFiles, async (f) => ({
            path: f.toString(),
            stats: await fs.promises.stat(f),
        })),
    );
}
