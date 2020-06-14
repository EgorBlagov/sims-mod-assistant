import { english } from "./english";

export type Formatter = (...args: (string | number | Date)[]) => string;
type TLanguageSchemaEntry = string | Formatter;

interface LSchemaMeta {
    [key: string]: TLanguageSchemaEntry;
}

export type Translation = typeof english;

// tslint:disable-next-line: no-empty
function assertLanguageSchema(_: LSchemaMeta) {}
assertLanguageSchema(english);
