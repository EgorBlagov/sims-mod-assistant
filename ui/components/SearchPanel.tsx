import { Box, Button } from "@material-ui/core";
import * as React from "react";
import { ipc } from "../../common/ipc";
import { ISearchParams } from "../../common/types";
import { useL10n } from "../utils/L10n";
import { SearchParametersForm } from "./SearchParametersForm";

interface IProps {
    targetPath: string;
}

export const SearchPanel = ({ targetPath }: IProps) => {
    const [l10n, _] = useL10n();
    const [params, setParams] = React.useState<ISearchParams>({ searchMd5: true, searchTgi: false });

    const startSearch = () => {
        ipc.renderer.startSearch({ targetPath, ...params });
    };

    const rest = (
        <Button color="primary" variant="contained" onClick={startSearch}>
            {l10n.start}
        </Button>
    );
    return (
        <>
            <SearchParametersForm params={params} setParams={setParams} />
            <Box display="flex" justifyContent="center">
                {rest}
            </Box>
        </>
    );
};
