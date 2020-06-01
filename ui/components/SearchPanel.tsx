import { Box, Button, Collapse, Slide } from "@material-ui/core";
import * as _ from "lodash";
import * as React from "react";
import { ipc } from "../../common/ipc";
import { isOk } from "../../common/tools";
import { ISearchParams, ISearchResult, TTicketId } from "../../common/types";
import { ipcHooks } from "../utils/hooks";
import { useL10n } from "../utils/L10n";
import { useNotification } from "../utils/notifications";
import { FilesArea } from "./FilesArea";
import { ProgressBar } from "./ProgressBar";
import { SearchParametersForm } from "./SearchParametersForm";

interface IProps {
    targetPath: string;
}

export const SearchPanel = ({ targetPath }: IProps) => {
    const [l10n, __] = useL10n();
    const [params, setParams] = React.useState<ISearchParams>({ searchMd5: true, searchTgi: false });
    const [searchTicketId, setSearchTicketId] = React.useState<TTicketId>();
    const [progress, setProgress] = React.useState<number>(0);
    const [result, setResult] = React.useState<ISearchResult>();
    const notification = useNotification();
    ipcHooks.use.searchProgress((___, args) => {
        if (searchTicketId === args.ticketId) {
            setProgress(args.progress);
        }
    });

    ipcHooks.use.searchResult((___, searchResult) => {
        if (isOk(searchResult)) {
            setResult(searchResult);
            setSearchTicketId(undefined);
            setProgress(0);
            notification.showSuccess(l10n.searchFinished);
        }
    });

    const startSearch = () => {
        if (!isOk(searchTicketId)) {
            setResult(undefined);
            ipc.renderer.rpc.startSearch({ targetPath, ...params }).then((res) => {
                setSearchTicketId(res.searchTicketId);
            });
        }
    };

    const interruptSearch = () => {
        ipc.renderer.rpc.interruptSearch().then(() => {
            setSearchTicketId(undefined);
            setProgress(0);
        });
    };

    const getTotalDuplicates = (res: ISearchResult): number => {
        if (!isOk(res)) {
            return 0;
        }

        return _.reduce(res.entries, (sum, entry) => (sum += entry.duplicates.length), 0);
    };

    return (
        <>
            <SearchParametersForm editable={!isOk(searchTicketId)} params={params} setParams={setParams} />
            <Collapse in={isOk(searchTicketId)}>
                <Box my={1} display="flex" alignItems="center">
                    <Box flex="auto" mr={1}>
                        <ProgressBar progress={progress} />
                    </Box>
                    <Button onClick={interruptSearch}>{l10n.cancel}</Button>
                </Box>
            </Collapse>
            <Collapse in={!isOk(searchTicketId)}>
                <Box display="flex" justifyContent="center">
                    <Button color="primary" variant="contained" onClick={startSearch}>
                        {l10n.start}
                    </Button>
                </Box>
            </Collapse>
            <Box my={1} overflow="auto" flexGrow={1}>
                <Collapse in={isOk(result)}>
                    <FilesArea searchInfo={result} />
                </Collapse>
            </Box>

            <Slide in={isOk(result)} direction="up">
                <Button color="secondary" variant="contained">
                    {l10n.moveDuplicates}
                </Button>
            </Slide>
        </>
    );
};
