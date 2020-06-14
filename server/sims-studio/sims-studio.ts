import * as _ from "lodash";
import * as path from "path";
import { LocalizedError } from "../../common/errors";
import { getAllFilesInDirectory } from "../fs-util";

export interface ISimsStudio {
    validateDir(path: string): Promise<void>;
}

const SIMS_STUDIO_EXE = "S4Studio.exe";

class SimsStudio implements ISimsStudio {
    async validateDir(dirPath: string): Promise<void> {
        const files = await getAllFilesInDirectory(dirPath, false);
        if (!_.some(files, (x) => path.basename(x.toString()).toLowerCase() === SIMS_STUDIO_EXE.toLowerCase())) {
            throw new LocalizedError("fileNotFound", SIMS_STUDIO_EXE);
        }
    }
}

export const simsStudio: ISimsStudio = new SimsStudio();
