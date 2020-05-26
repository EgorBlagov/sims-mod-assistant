import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import * as React from "react";
import { useL10n } from "../utils/L10n";

enum ParameterNames {
    SearchExact = "SearchExact",
    SearchCatalogue = "SearchCatalogue",
}

export const SearchParametersForm = () => {
    const [searchExact, setSearchExact] = React.useState(false);
    const [searchCatalogue, setSearchCatalogue] = React.useState(false);
    const [l10n, _] = useL10n();

    const setterMap = {
        [ParameterNames.SearchExact]: setSearchExact,
        [ParameterNames.SearchCatalogue]: setSearchCatalogue,
    };

    const handleChange = (event) => {
        setterMap[event.target.name](event.target.checked);
    };

    return (
        <FormGroup>
            <FormControlLabel
                control={<Switch checked={searchExact} onChange={handleChange} name={ParameterNames.SearchExact} />}
                label={l10n.searchExactDoubles}
            />
            <FormControlLabel
                control={
                    <Switch checked={searchCatalogue} onChange={handleChange} name={ParameterNames.SearchCatalogue} />
                }
                label={l10n.searchCatalogueConflicts}
            />
        </FormGroup>
    );
};
