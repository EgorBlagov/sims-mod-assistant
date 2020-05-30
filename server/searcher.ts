import * as fs from "fs";
import * as path from "path";
import { IDirectoryInfo } from "../common/types";
import { logger } from "./logging";

const MB: number = 1024 * 1024;

interface ISearcher {
    getDirectoryInfo(targetPath: string): Promise<IDirectoryInfo>;
}

class Searcher implements ISearcher {
    async getDirectoryInfo(targetPath: string): Promise<IDirectoryInfo> {
        const result: IDirectoryInfo = {
            filesCount: 0,
            sizeMb: 0,
        };

        const contents = await fs.promises.readdir(targetPath, { withFileTypes: true });
        for (const entry of contents) {
            const entryPath = path.join(targetPath, entry.name);
            if (entry.isDirectory()) {
                const subDir = await this.getDirectoryInfo(entryPath);
                result.filesCount += subDir.filesCount;
                result.sizeMb += subDir.sizeMb;
            } else {
                result.filesCount++;
                result.sizeMb += (await fs.promises.stat(entryPath)).size / MB;
            }
        }
        logger.info(`Directory Info: ${targetPath}: total size: ${result.sizeMb} MB`);
        return result;
    }
}

export const searcher: ISearcher = new Searcher();
