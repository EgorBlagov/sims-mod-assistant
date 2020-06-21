export function isValidRegex(reg: string) {
    try {
        // tslint:disable-next-line: no-unused-expression
        new RegExp(reg);
        return true;
    } catch {
        return false;
    }
}
