import { Box, Button } from "@material-ui/core";
import * as React from "react";
import { ipc } from "../../common/ipc";
import { isOk } from "../../common/tools";
import { ISearchParams, TTicketId } from "../../common/types";
import { useIpcEvent } from "../hooks";
import { useL10n } from "../utils/L10n";
import { ProgressBar } from "./ProgressBar";
import { SearchParametersForm } from "./SearchParametersForm";

interface IProps {
    targetPath: string;
}

export const SearchPanel = ({ targetPath }: IProps) => {
    const [l10n, _] = useL10n();
    const [params, setParams] = React.useState<ISearchParams>({ searchMd5: true, searchTgi: false });
    const [searchTicketId, setSearchTicketId] = React.useState<TTicketId>();
    const [progress, setProgress] = React.useState<number>(0);

    useIpcEvent("searchProgress", (event, args) => {
        if (searchTicketId === args.ticketId) {
            setProgress(args.progress);
        }
    });

    const startSearch = () => {
        ipc.renderer.rpc.startSearch({ targetPath, ...params }).then((res) => {
            setSearchTicketId(res.searchTicketId);
        });
    };

    const rest = isOk(searchTicketId) ? (
        <ProgressBar progress={progress} />
    ) : (
        <Box display="flex" justifyContent="center">
            <Button color="primary" variant="contained" onClick={startSearch}>
                {l10n.start}
            </Button>
        </Box>
    );
    return (
        <>
            <SearchParametersForm params={params} setParams={setParams} />
            {rest}
        </>
    );
};
