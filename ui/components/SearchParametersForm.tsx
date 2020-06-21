import { FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from "@material-ui/core";
import React from "react";
import { ISearchParams } from "../../common/types";
import { useL10n } from "../utils/l10n-hooks";

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
    const [l10n] = useL10n();

    const setterMap = {
        [ParameterNames.SearchExact]: () => {
            setParams({ ...params, searchTgi: false, searchMd5: true });
        },
        [ParameterNames.SearchCatalog]: () => {
            setParams({ ...params, searchMd5: false, searchTgi: true });
        },
    };

    const handleChange = (event) => {
        setterMap[event.target.value]();
    };

    return (
        <FormGroup>
            <FormLabel component="legend">{l10n.searchMode}</FormLabel>
            <RadioGroup
                value={params.searchTgi ? ParameterNames.SearchCatalog : ParameterNames.SearchExact}
                onChange={handleChange}
            >
                <FormControlLabel
                    value={ParameterNames.SearchExact}
                    control={<Radio />}
                    disabled={!editable}
                    label={l10n.searchExactDoubles}
                />
                <FormControlLabel
                    value={ParameterNames.SearchCatalog}
                    control={<Radio />}
                    disabled={!editable}
                    label={l10n.searchCatalogConflicts}
                />
            </RadioGroup>
        </FormGroup>
    );
};
