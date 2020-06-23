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
        const toSearch = filesFilter.isRegex ? new RegExp(filesFilter.filter) : filesFilter.filter;
        return path.basename(p).search(toSearch) !== -1;
    }

    return true;
};
