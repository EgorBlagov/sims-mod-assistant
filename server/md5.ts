import * as crypto from "crypto";
import { promises as fs } from "fs";

export async function md5(path: string): Promise<string> {
    const file = await fs.readFile(path);
    return crypto.createHash("md5").update(file).digest("hex");
}
