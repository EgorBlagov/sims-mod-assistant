import { Translation } from "./types";

export const russian: Translation = {
    language: "Язык",
    selectLangauge: "Выберите язык",
    chooseDir: "Выберите папку",
    open: "Открыть",
    dirInfo: (filesCount, sizeMb) => `Всего файлов: ${filesCount}, размер: ${sizeMb} Мб`,
    searchMode: "Режим поиска",
    searchExactDoubles: "Искать идеальные дубликаты",
    searchCatalogConflicts: "Искать конфликты в каталоге",
    start: "Начать",
    cancel: "Отменить",
    errorPath: (msg: string) => `Не удалось получить информацию о директории: ${msg}`,
    errorOpenPath: (msg: string) => `Не удалось открыть директории через диалог: ${msg}`,
    searchFinished: "Поиск завершен",
    date: (d: Date) => d.toLocaleString("ru-RU"),
    moveDuplicates: "Переместить все дубликаты в отдельную папку",
    enableForSearch: "Включите хотя бы один параметр чтобы запустить поиск",
    duplicates: (count: number) => `Дубликаты (${count})`,
    skippedFiles: (count: number) => `Пропущенные файлы (${count})`,
    unsupportedSimsVersion: "Неподдерживаемая версия Пакета",
    unsupportedSimsVersionTooltip: "Возможно это не Пакет Sims 4",
    notPackage: "Не Пакет",
    notPackageDescription: "Файл не является Пакетом Sims",
    unableToParse: "Не удалось распознать",
    unableToParseDescription: "Неизвестная ошибка во время распознавания файла",
    momentLibLocale: "ru",
    calculatingTime: "оценка...",
    searchInterrupted: "Поиск прерван",
    moveSuccess: "Все дубликаты успешно перемещены",
    errorMove: (msg: string) => `Не удалось переместить файлы: ${msg}`,
    about: "О программе",
    author: "Автор",
    assistant: "Ассистент и Вдохновитель",
    description:
        "Небольшое приложение для игроков Sims 4 для быстрого и удобного поиска дубликатов и конфликтных дополнений",

    exact: "Копия",
    exactDescription: "Полная копия (MD5 хеш совпадает)",

    catalog: "Каталог",
    catalogDescription: "Предметы для строительства: столы, фонтаны, кровати...",

    skintone: "Skintone",
    skintoneDescription: "Макияж, особенности кожи, маски...",

    cas: "CAS",
    casDescription: "Одежда, волосы, обувь...",

    slider: "Слайдер",
    sliderDescription: "Слайдеры (Хот споты): форма рта, форма шеи...",

    settings: "Настройки",
    simsStudioPath: "Папка с Sims4Studio (необязательно)",
    fileNotFound: (file: string) => `${file} не найден`,
    studioValidPath: "Папка с Sims4Studio выбрана",
    studioDisabled: (message: string) => `Не удалось найти Sims4Studio из настроек: ${message}`,

    settingsSaved: "Настройки успешно сохранены",
    settingsSaveError: (err: string) => `Не удалось сохранить настройки: ${err}`,
    invalidTicketId: "Внутренняя ошибка: неверный идентификатор поиска",
    detailed: "Детально",
};
