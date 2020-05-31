import * as React from "react";
import { Language } from "../../common/l10n";
import { LanguageContext } from "../utils/L10n";
import { INotificationContext, NotificationContext, NotificationTypes } from "../utils/notifications";
import { Main } from "./Main";
import { NotificationSnackbar } from "./NotificationSnackbar";

interface IState {
    currentLanguage: Language;

    notificationMessage: string;
    notificationType: NotificationTypes;
    notificationVisible: boolean;
}

export class App extends React.Component<{}, IState> {
    state: IState = {
        currentLanguage: Language.English,
        notificationMessage: undefined,
        notificationType: undefined,
        notificationVisible: false,
    };

    setLanguage = (newLanguage: Language) => {
        this.setState({ currentLanguage: newLanguage });
    };

    createNotificationContext = (): INotificationContext => {
        return {
            setMessage: (msg) => this.setState({ notificationMessage: msg }),
            setType: (type) => this.setState({ notificationType: type }),
            setVisible: this.handleNotificationSetVisible,
        };
    };

    handleNotificationSetVisible = (visible: boolean): void => {
        this.setState({ notificationVisible: visible });
    };

    render() {
        const { notificationMessage, notificationType, notificationVisible } = this.state;
        return (
            <NotificationContext.Provider value={this.createNotificationContext()}>
                <LanguageContext.Provider value={this.state.currentLanguage}>
                    <Main setLanguage={this.setLanguage} />
                    <NotificationSnackbar
                        message={notificationMessage}
                        type={notificationType}
                        visible={notificationVisible}
                        setVisible={this.handleNotificationSetVisible}
                    />
                </LanguageContext.Provider>
            </NotificationContext.Provider>
        );
    }
}
