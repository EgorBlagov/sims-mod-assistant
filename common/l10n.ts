type Formatter = (...args: string[]) => string;

interface LSchemaMeta {
    [key: string]: string | Formatter;
}

export const english = {
    language: "Language",
};

export type Translation = typeof english;

// tslint:disable-next-line: no-empty
function assertLanguageSchema(_: LSchemaMeta) {}
assertLanguageSchema(english);

export const russian: Translation = {
    language: "Язык",
};

export enum Language {
    English = "English",
    Russian = "Русский",
}

export const l10n: Record<Language, Translation> = {
    [Language.English]: english,
    [Language.Russian]: russian,
};
