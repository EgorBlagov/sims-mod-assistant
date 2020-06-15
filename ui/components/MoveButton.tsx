import { Button, Slide } from "@material-ui/core";
import { remote } from "electron";
import * as React from "react";
import { ipc } from "../../common/ipc";
import { useBackdropBound } from "../utils/backdrop-hooks";
import { useL10n } from "../utils/l10n-hooks";
import { useNotification } from "../utils/notifications";

interface IProps {
    searchDone: boolean;
    resetSearchState: () => void;
}

export const MoveButton = ({ searchDone, resetSearchState }: IProps) => {
    const [l10n] = useL10n();
    const notification = useNotification();
    const [moveDisabled, setMoveDisabled] = React.useState<boolean>(false);
    useBackdropBound(moveDisabled);

    const moveItems = async () => {
        setMoveDisabled(true);
        try {
            const dialogResult = await remote.dialog.showOpenDialog({ properties: ["openDirectory"] });
            if (!dialogResult.canceled) {
                await ipc.renderer.rpc.moveDuplicates({ targetDir: dialogResult.filePaths[0] });
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
            <Slide in={searchDone} direction="up">
                <Button color="primary" variant="contained" onClick={openDalog} disabled={moveDisabled}>
                    {l10n.moveDuplicates}
                </Button>
            </Slide>
        </>
    );
};
