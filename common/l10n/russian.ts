import { Translation } from "./types";

export const russian: Translation = {
    language: "Язык",
    selectLangauge: "Выберите язык",
    chooseDir: "Выберите папку",
    open: "Открыть",
    dirInfo: (filesCount, sizeMb) => `Всего файлов: ${filesCount}, размер: ${sizeMb} Мб`,
    searchExactDoubles: "Искать идеальные дубликаты",
    searchCatalogueConflicts: "Искать конфликты в каталоге",
    start: "Начать",
    cancel: "Отменить",
    errorPath: (msg: string) => `Не удалось получить информацию о директории: ${msg}`,
    errorOpenPath: (msg: string) => `Не удалось открыть директории через диалог: ${msg}`,
};
