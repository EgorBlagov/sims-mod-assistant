import { Button, Slide } from "@material-ui/core";
import { remote } from "electron";
import * as React from "react";
import { ipc } from "../../common/ipc";
import { isOk } from "../../common/tools";
import { ISearchResult } from "../../common/types";
import { useBackdropBound } from "../utils/backdrop-hooks";
import { useL10n } from "../utils/l10n-hooks";
import { useNotification } from "../utils/notifications";

interface IProps {
    searchInfo: ISearchResult;
    resetSearchState: () => void;
}

export const MoveButton = ({ searchInfo, resetSearchState }: IProps) => {
    const [l10n] = useL10n();
    const notification = useNotification();
    const [moveDisabled, setMoveDisabled] = React.useState<boolean>(false);
    useBackdropBound(moveDisabled);

    const moveItems = async () => {
        setMoveDisabled(true);
        try {
            const dialogResult = await remote.dialog.showOpenDialog({ properties: ["openDirectory"] });
            if (!dialogResult.canceled) {
                await ipc.renderer.rpc.moveDuplicates({ info: searchInfo, targetDir: dialogResult.filePaths[0] });
                notification.showSuccess(l10n.moveSuccess);
                resetSearchState();
            }
        } finally {
            setMoveDisabled(false);
        }
    };

    const openDalog = () => {
        moveItems().catch((err) => notification.showError(l10n.errorMove(err.message)));
    };

    return (
        <>
            <Slide in={isOk(searchInfo)} direction="up">
                <Button color="primary" variant="contained" onClick={openDalog} disabled={moveDisabled}>
                    {l10n.moveDuplicates}
                </Button>
            </Slide>
        </>
    );
};
