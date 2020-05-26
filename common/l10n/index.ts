import { english } from "./english";
import { russian } from "./russian";
import { Translation } from "./types";

export enum Language {
    English = "English",
    Russian = "Русский",
}

export const l10n: Record<Language, Translation> = {
    [Language.English]: english,
    [Language.Russian]: russian,
};
