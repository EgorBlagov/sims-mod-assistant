import path from "path";
import { isOk } from "../../common/tools";
import { IFilterParams } from "../redux/conflict-resolver/reducers";

const isValidRegex = (reg: string) => {
    try {
        // tslint:disable-next-line: no-unused-expression
        new RegExp(reg);
        return true;
    } catch {
        return false;
    }
};

export const isFilterUsed = ({ filter }: IFilterParams) => isOk(filter) && filter.length !== 0;

export const isFilterValid = (filterParams: IFilterParams) =>
    isFilterUsed(filterParams) && (!filterParams.isRegex || isValidRegex(filterParams.filter));

export const pathFilter = (filesFilter: IFilterParams) => (p: string): boolean => {
    if (isFilterValid(filesFilter)) {
        let basename = path.basename(p);
        let filter = filesFilter.filter;

        if (!filesFilter.isCaseSensitive) {
            basename = basename.toLowerCase();
            filter = filter.toLowerCase();
        }

        const index = filesFilter.isRegex ? basename.search(filter) : basename.indexOf(filter);
        return index !== -1;
    }

    return true;
};
