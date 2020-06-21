import { Button, Dialog, DialogContent, DialogTitle, List } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getErrorMessage } from "../../../common/errors";
import { Language } from "../../../common/l10n";
import * as ActionCreators from "../../redux/action-creators";
import { TState } from "../../redux/reducers";
import { useL10n } from "../../utils/l10n-hooks";
import { useNotification } from "../../utils/notifications";
import { saveSettings } from "../../utils/settings/settings";
import { LanguageField } from "./LanguageField";
import { SimsStudioPathField } from "./SimsStudioPathField";

// class AppImpl extends React.Component<IProps> {
//     componentDidMount() {}

//     componentDidUpdate(prevProps: IProps) {
//         if (prevProps.language !== this.props.language) {
//             ipc.renderer.rpc.setLanguage(this.props.language).catch((err) => {
//                 this.getNotificationApi().showError(err);
//             });

//             saveSettings({ language: this.props.language }).catch((err) => {
//                 this.getNotificationApi().showError(err);
//             });
//         }
//     }

// }

export const SettingsButton = () => {
    const [l10n] = useL10n();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const notification = useNotification();
    const currentSettings = useSelector((state: TState) => state.settings);

    const handleClickOpen = () => setDialogOpen(true);

    const handleClickClose = () => {
        setDialogOpen(false);
        saveSettings(currentSettings)
            .then(() => notification.showSuccess(l10n.settingsSaved))
            .catch((err) => notification.showError(l10n.settingsSaveError(getErrorMessage(err, l10n))));
    };

    const dispatch = useDispatch();

    const setLanguage = (l: Language) => {
        dispatch(ActionCreators.settingsSetLanguage(l));
    };

    const setStudioPath = (studioPath: string) => {
        dispatch(ActionCreators.settingsSetSimsStudioPath(studioPath));
    };

    return (
        <>
            <Button size="small" onClick={handleClickOpen}>
                {l10n.settings}
            </Button>
            <Dialog onClose={handleClickClose} open={dialogOpen} fullWidth={true} maxWidth="md">
                <DialogTitle>{l10n.settings}</DialogTitle>
                <DialogContent>
                    <List>
                        <LanguageField setLanguage={setLanguage} />
                        <SimsStudioPathField studioPath={currentSettings.studioPath} setStudioPath={setStudioPath} />
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
};
