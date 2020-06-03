import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import * as React from "react";
import { ISearchParams } from "../../common/types";
import { useL10n } from "../utils/L10n";

enum ParameterNames {
    SearchExact = "SearchExact",
    SearchCatalog = "SearchCatalog",
}

interface IProps {
    params: ISearchParams;
    setParams: (newParams: ISearchParams) => void;
    editable: boolean;
}

export const SearchParametersForm = ({ params, setParams, editable }: IProps) => {
    const [l10n, _] = useL10n();

    const setterMap = {
        [ParameterNames.SearchExact]: (searchExact: boolean) => {
            setParams({ ...params, searchMd5: searchExact });
        },
        [ParameterNames.SearchCatalog]: (searchCatalog: boolean) => {
            setParams({ ...params, searchTgi: searchCatalog });
        },
    };

    const handleChange = (event) => {
        setterMap[event.target.name](event.target.checked);
    };

    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Checkbox
                        disabled={!editable}
                        checked={params.searchMd5}
                        onChange={handleChange}
                        name={ParameterNames.SearchExact}
                    />
                }
                label={l10n.searchExactDoubles}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        disabled={!editable}
                        checked={params.searchTgi}
                        onChange={handleChange}
                        name={ParameterNames.SearchCatalog}
                    />
                }
                label={l10n.searchCatalogConflicts}
            />
        </FormGroup>
    );
};
