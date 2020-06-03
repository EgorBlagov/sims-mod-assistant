import { Translation } from "./types";

export const russian: Translation = {
    language: "Язык",
    selectLangauge: "Выберите язык",
    chooseDir: "Выберите папку",
    open: "Открыть",
    dirInfo: (filesCount, sizeMb) => `Всего файлов: ${filesCount}, размер: ${sizeMb} Мб`,
    searchExactDoubles: "Искать идеальные дубликаты",
    searchCatalogConflicts: "Искать конфликты в каталоге",
    start: "Начать",
    cancel: "Отменить",
    errorPath: (msg: string) => `Не удалось получить информацию о директории: ${msg}`,
    errorOpenPath: (msg: string) => `Не удалось открыть директории через диалог: ${msg}`,
    searchFinished: "Поиск завершен",
    exactDuplicate: "Полная копия",
    catalogDuplicate: "Перекрытие в каталоге",
    date: (d: Date) => d.toLocaleString("ru-RU"),
    moveDuplicates: "Переместить все дубликаты в отдельную папку",
    enableForSearch: "Включите хотя бы один параметр чтобы запустить поиск",
    catalogDuplicateDescription: "Object Catalog или Object Definition (Type, Group и Id) такие же как и у оригинала",
};
