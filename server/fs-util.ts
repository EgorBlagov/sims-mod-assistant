import * as fs from "fs";
import * as path from "path";

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
