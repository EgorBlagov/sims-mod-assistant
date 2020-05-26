import { english } from "./english";

type Formatter = (...args: string[]) => string;

interface LSchemaMeta {
    [key: string]: string | Formatter;
}

export type Translation = typeof english;

// tslint:disable-next-line: no-empty
function assertLanguageSchema(_: LSchemaMeta) {}
assertLanguageSchema(english);
