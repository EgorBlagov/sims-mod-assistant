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
    date: (d: Date) => d.toLocaleString("en-US"),
    moveDuplicates: "Move selected",
    enableForSearch: "Enable at least one options to start search",
    conflicts: (count: number) => `Conflicts (${count})`,
    skippedFiles: (count: number) => `Skipped files (${count})`,
    unsupportedSimsVersion: "Unsupported Package version",
    unsupportedSimsVersionTooltip: "Might be not Sims 4 package at all",
    notPackage: "Not package",
    notPackageDescription: "File is not any Sims package",
    unableToParse: "Unable to parse",
    unableToParseDescription: "Unexpected error occured during parse",
    momentLibLocale: "en",
    calculatingTime: "estimation...",
    searchInterrupted: "Search interrupted",
    moveSuccess: "Selected files has been moved successfully",
    errorMove: (msg: string) => `Unable to move files: ${msg}`,
    about: "About",
    author: "Author",
    assistant: "Assistant & Inspiration",
    description: "Simple application to help Sims 4 players in searching and removing duplicates and conflicting mods",

    exact: "Exact",
    exactDescription: "Copy of file (MD5 hashes are same)",

    catalog: "Catalog",
    catalogDescription: "Build objects: tables, fountains, beds...",

    skintone: "Skintone",
    skintoneDescription: "Makeups, skin overlays, facemasks...",

    cas: "CAS",
    casDescription: "Clothes, hair, boots...",

    slider: "Slider",
    sliderDescription: "Sliders (hotspots): mouth shape, neck shape...",

    settings: "Settings",
    simsStudioPath: "Sims4Studio directory (optional)",
    fileNotFound: (file: string) => `${file} is not found`,
    studioValidPath: "Studio directory selected",
    studioDisabled: (message: string) => `Unable to find configured Sims4Studio: ${message}`,

    settingsSaved: "Settings were saved successfully",
    settingsSaveError: (err: string) => `Settings save error: ${err}`,

    invalidTicketId: "Internal Error: Invalid search ticket id",
    detailed: "Detailed",
    openDirectory: "Open directory",
    copyPath: "Copy path to clipboard",

    openInStudio: "Open package in Sims4Studio",
    studioNotConfigured: "Sims4Studio path is not configured (you can do it Settings)",
    copyPathSuccess: (path: string) => `Path ${path} successfully copied to clipboard`,
    conflictKeysDescription: "Conflicting keys (Type-Group-Instance):",
    selectAll: "Select all",
    clearSelection: "Clear selection",
    searchPlaceholder: "Search...",
    regexHelp: "Regular expressions support",
    caseHelp: "Case sensitivity",

    moveSubdirForbidden: "Move to same directory or subdirectory is forbidden, please, choose separate directory",
};
