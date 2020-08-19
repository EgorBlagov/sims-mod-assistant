import * as fs from "fs";
import * as path from "path";
import { LocalizedError } from "../common/errors";
import { IMoveParams } from "../common/types";
import { isWithinSameDir } from "./fs-util";

export interface IMover {
    move(params: IMoveParams): Promise<void>;
}

class Mover implements IMover {
    async move(params: IMoveParams): Promise<void> {
        this.validateNotSubdir(params.searchDir, params.targetDir);

        for (const filePath of params.filePaths) {
            const targetName = await this.findFreeName(params.targetDir, path.basename(filePath));
            await fs.promises.rename(filePath, targetName);
        }
    }

    private validateNotSubdir(origDir: string, targetDir: string) {
        if (isWithinSameDir(origDir, targetDir)) {
            throw new LocalizedError("moveSubdirForbidden");
        }
    }

    private async fileExists(targetPath: string): Promise<boolean> {
        try {
            await fs.promises.access(targetPath);
            return true;
        } catch {
            return false;
        }
    }

    private addSuffix(filePath: string, suffix: string): string {
        const dirname = path.dirname(filePath);
        const basename = path.basename(filePath);
        const extension = path.extname(basename);
        const name = path.basename(basename, extension);

        return path.join(dirname, `${name}${suffix}${extension}`);
    }

    private async findFreeName(targetDir: string, basename: string): Promise<string> {
        const baseTargetName = path.join(targetDir, basename);
        let targetName = baseTargetName;
        let i = 1;
        while (await this.fileExists(targetName)) {
            targetName = this.addSuffix(baseTargetName, `-copy${i}`);
            i++;
        }

        return targetName;
    }
}

export const mover: IMover = new Mover();
