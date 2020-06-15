import { Box, Grow } from "@material-ui/core";
import * as React from "react";
import { getErrorMessage } from "../../common/errors";
import { ipc } from "../../common/ipc";
import { isOk } from "../../common/tools";
import { ISearchParams, ISearchResult, TTicketId } from "../../common/types";
import { ipcHooks } from "../utils/hooks";
import { useL10n } from "../utils/l10n-hooks";
import { useNotification } from "../utils/notifications";
import { FilesArea } from "./files-area/FilesArea";
import { MoveButton } from "./MoveButton";
import { ProgressBar } from "./ProgressBar";
import { SearchParametersForm } from "./SearchParametersForm";
import { StartButton } from "./StartButton";

interface IProps {
    targetPath: string;
}

export const SearchPanel = ({ targetPath }: IProps) => {
    const [l10n] = useL10n();
    const [params, setParams] = React.useState<ISearchParams>({ searchMd5: true, searchTgi: false });
    const [searchTicketId, setSearchTicketId] = React.useState<TTicketId>();
    const [searchDone, setSearchDone] = React.useState<boolean>(false);
    const [searchResult, setSearchResult] = React.useState<ISearchResult>(undefined);
    const notification = useNotification();
    const isSearchInProgress = isOk(searchTicketId) && !searchDone;

    const resetSearchState = () => {
        setSearchDone(false);
        setSearchTicketId(undefined);
        setSearchResult(undefined);
    };

    ipcHooks.use.searchResult((___, ticketId) => {
        if (ticketId === searchTicketId) {
            ipc.renderer.rpc
                .getSearchResult(ticketId)
                .then((res) => setSearchResult(res))
                .catch((err) => notification.showError(getErrorMessage(err, l10n)));

            setSearchDone(true);
            notification.showSuccess(l10n.searchFinished);
        }
    });

    ipcHooks.use.searchError((___, { error, ticketId }) => {
        notification.showError(getErrorMessage(error, l10n));
        if (ticketId === searchTicketId) {
            resetSearchState();
        }
    });

    const startSearch = () => {
        if (!isSearchInProgress) {
            resetSearchState();
            ipc.renderer.rpc.startSearch({ targetPath, ...params }).then((res) => {
                setSearchTicketId(res.searchTicketId);
            });
        }
    };

    const interruptSearch = () => {
        ipc.renderer.rpc.interruptSearch().then(() => {
            resetSearchState();
        });
    };

    return (
        <>
            <SearchParametersForm editable={!isSearchInProgress} params={params} setParams={setParams} />
            <ProgressBar interruptSearch={interruptSearch} ticketId={searchTicketId} searchDone={searchDone} />
            <Grow in={!isSearchInProgress}>
                <Box display="flex" justifyContent="center">
                    <StartButton params={params} onClick={startSearch} />
                </Box>
            </Grow>
            <FilesArea searchInfo={searchResult} />
            <MoveButton searchDone={searchDone} resetSearchState={resetSearchState} />
        </>
    );
};
