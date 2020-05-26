type Formatter = (...args: string[]) => string;

interface LSchemaMeta {
    [key: string]: string | Formatter;
}

export const english = {
    language: "Language",
    selectLangauge: "Select language",
    chooseDir: "Choose a directory",
    dirInfo: (filesCount: string, sizeMb: string) => `Total files: ${filesCount}, size: ${sizeMb} Mb`,
    searchExactDoubles: "Search exact doubles",
    searchCatalogueConflicts: "Search catalogue conflicts",
};

export type Translation = typeof english;

// tslint:disable-next-line: no-empty
function assertLanguageSchema(_: LSchemaMeta) {}
assertLanguageSchema(english);

export const russian: Translation = {
    language: "Язык",
    selectLangauge: "Выберите язык",
    chooseDir: "Выберите папку",
    dirInfo: (filesCount, sizeMb) => `Всего файлов: ${filesCount}, размер: ${sizeMb} Мб`,
    searchExactDoubles: "Искать идеальные дубликаты",
    searchCatalogueConflicts: "Искать конфликты в каталоге",
};

export enum Language {
    English = "English",
    Russian = "Русский",
}

export const l10n: Record<Language, Translation> = {
    [Language.English]: english,
    [Language.Russian]: russian,
};
