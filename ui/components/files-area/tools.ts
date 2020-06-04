import { shell } from "electron";

export const getShowFileHandler = (path: string) => () => shell.showItemInFolder(path);
