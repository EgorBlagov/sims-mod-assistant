export const english = {
    language: "Language",
    selectLangauge: "Select language",
    chooseDir: "Choose a directory",
    open: "Open",
    dirInfo: (filesCount: string | number, sizeMb: string | number) => `Total files: ${filesCount}, size: ${sizeMb} Mb`,
    searchExactDoubles: "Search exact doubles",
    searchCatalogueConflicts: "Search catalogue conflicts",
    start: "Start",
    cancel: "Cancel",
    errorPath: (msg: string) => `Unable to get directory info: ${msg}`,
    errorOpenPath: (msg: string) => `Unable to open path with dialog: ${msg}`,
};
