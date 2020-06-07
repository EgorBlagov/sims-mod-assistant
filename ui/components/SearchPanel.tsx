import { Box, Button, Collapse, Grow } from "@material-ui/core";
import * as React from "react";
import { ipc } from "../../common/ipc";
import { isOk } from "../../common/tools";
import { ISearchParams, ISearchResult, TTicketId } from "../../common/types";
import { ipcHooks } from "../utils/hooks";
import { useL10n } from "../utils/L10n";
import { useNotification } from "../utils/notifications";
import { EstimatedTime } from "./EstimatedTime";
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
    const [searchStartTime, setSearchStartTime] = React.useState<Date>();
    const [progressRelative, setProgressRelative] = React.useState<number>(0);
    const [result, setResult] = React.useState<ISearchResult>();
    const notification = useNotification();

    const resetSearchState = () => {
        setResult(undefined);
        setSearchTicketId(undefined);
        setSearchStartTime(undefined);
        setProgressRelative(0);
    };

    ipcHooks.use.searchProgress((___, args) => {
        if (searchTicketId === args.ticketId) {
            setProgressRelative(args.progressRelative);
        }
    });

    ipcHooks.use.searchResult((___, searchResult) => {
        if (isOk(searchResult)) {
            resetSearchState();
            setResult(searchResult);
            notification.showSuccess(l10n.searchFinished);
        }
    });

    ipcHooks.use.searchError((___, { errorMessage, ticketId }) => {
        notification.showError(errorMessage);
        if (ticketId === searchTicketId) {
            resetSearchState();
        }
    });

    const startSearch = () => {
        if (!isOk(searchTicketId)) {
            setResult(undefined);
            ipc.renderer.rpc.startSearch({ targetPath, ...params }).then((res) => {
                setSearchTicketId(res.searchTicketId);
                setSearchStartTime(new Date());
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
            <SearchParametersForm editable={!isOk(searchTicketId)} params={params} setParams={setParams} />
            <Collapse in={isOk(searchTicketId)}>
                <Box my={1} display="flex" alignItems="center">
                    <Box flex="auto" mr={1}>
                        <ProgressBar progressRelative={progressRelative} />
                    </Box>
                    <Box mr={1}>
                        <EstimatedTime progressRelative={progressRelative} startTime={searchStartTime} />
                    </Box>

                    <Button onClick={interruptSearch}>{l10n.cancel}</Button>
                </Box>
            </Collapse>
            <Grow in={!isOk(searchTicketId)}>
                <Box display="flex" justifyContent="center">
                    <StartButton params={params} onClick={startSearch} />
                </Box>
            </Grow>
            <FilesArea searchInfo={result} />
            <MoveButton searchInfo={result} resetSearchState={resetSearchState} />
        </>
    );
};
