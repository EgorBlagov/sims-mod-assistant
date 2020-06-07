export const english = {
    language: "Language",
    selectLangauge: "Select language",
    chooseDir: "Choose a directory",
    open: "Open",
    dirInfo: (filesCount: string | number, sizeMb: string | number) => `Total files: ${filesCount}, size: ${sizeMb} Mb`,
    searchMode: "Search mode",
    searchExactDoubles: "Search exact doubles",
    searchCatalogConflicts: "Search catalog conflicts",
    start: "Start",
    cancel: "Cancel",
    errorPath: (msg: string) => `Unable to get directory info: ${msg}`,
    errorOpenPath: (msg: string) => `Unable to open path with dialog: ${msg}`,
    searchFinished: "Search finished",
    exactDuplicate: "Exact duplicate",
    catalogDuplicate: "Catalog overlap",
    date: (d: Date) => d.toLocaleString("en-US"),
    moveDuplicates: "Move all duplicates to separate directory",
    enableForSearch: "Enable at least one options to start search",
    catalogDuplicateDescription:
        "Object Catalog or Object Definition (Type, Group and Id) are same as in original file",
    duplicates: (count: number) => `Duplicates (${count})`,
    skippedFiles: (count: number) => `Skipped files (${count})`,
    unsupportedIndexType: "Unsupported Index Type",
    unsupportedSimsVersion: "Unsupported Package version",
    unsupportedIndexTypeTooltip: "Package contents format is not supported by the application",
    unsupportedSimsVersionTooltip: "Might be not Sims 4 package at all",
    notPackage: "Not package",
    notPackageDescription: "File is not any Sims package",
    unableToParse: "Unable to parse",
    unableToParseDescription: "Unexpected error occured during parse",
    momentLibLocale: "en",
    calculatingTime: "estimation...",
    searchInterrupted: "Search interrupted",
};
