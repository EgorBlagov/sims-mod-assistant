import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import * as React from "react";
import { ISearchParams } from "../../common/types";
import { useL10n } from "../utils/L10n";

enum ParameterNames {
    SearchExact = "SearchExact",
    SearchCatalogue = "SearchCatalogue",
}

interface IProps {
    params: ISearchParams;
    setParams: (newParams: ISearchParams) => void;
}

export const SearchParametersForm = ({ params, setParams }: IProps) => {
    const [l10n, _] = useL10n();

    const setterMap = {
        [ParameterNames.SearchExact]: (searchExact: boolean) => {
            setParams({ ...params, searchMd5: searchExact });
        },
        [ParameterNames.SearchCatalogue]: (searchCatalogue: boolean) => {
            setParams({ ...params, searchTgi: searchCatalogue });
        },
    };

    const handleChange = (event) => {
        setterMap[event.target.name](event.target.checked);
    };

    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Switch checked={params.searchMd5} onChange={handleChange} name={ParameterNames.SearchExact} />
                }
                label={l10n.searchExactDoubles}
            />
            <FormControlLabel
                control={
                    <Switch checked={params.searchTgi} onChange={handleChange} name={ParameterNames.SearchCatalogue} />
                }
                label={l10n.searchCatalogueConflicts}
            />
        </FormGroup>
    );
};
