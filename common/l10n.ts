type Formatter = (...args: string[]) => string;

interface LSchemaMeta {
    [key: string]: string | Formatter;
}

export interface Translation extends LSchemaMeta {
    fetchedInfo: string;
    systemInfo: Formatter;
}

export const english: Translation = {
    fetchedInfo: "Fetched info: ",
    systemInfo: (exampleParam) => `System Info (param: ${exampleParam}): `,
};

export const russian: Translation = {
    fetchedInfo: "Полученная информация: ",
    systemInfo: (exampleParam) => `Системная информация ${exampleParam}): `,
};

export enum Language {
    English,
    Russian,
}

export const l10n: Record<Language, Translation> = {
    [Language.English]: english,
    [Language.Russian]: russian,
};
