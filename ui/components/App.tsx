import * as React from "react";
import { connect } from "react-redux";
import { ipc } from "../../common/ipc";
import { Language } from "../../common/l10n";
import { TState } from "../redux/reducers";
import {
    createNotificationApiFromContext,
    INotificationContext,
    NotificationContext,
    NotificationTypes,
} from "../utils/notifications";
import "./common.css";
import { Main } from "./Main";
import { NotificationSnackbar } from "./NotificationSnackbar";

interface IState {
    notificationMessage: string;
    notificationType: NotificationTypes;
    notificationVisible: boolean;
}

interface IProps {
    language: Language;
}

class AppImpl extends React.Component<IProps, IState> {
    state: IState = {
        notificationMessage: undefined,
        notificationType: undefined,
        notificationVisible: false,
    };

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.language !== this.props.language) {
            ipc.renderer.rpc.setLanguage(this.props.language).catch((err) => {
                // Notification context is not available here
                createNotificationApiFromContext(this.createNotificationContext()).showError(err);
            });
        }
    }

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
                <Main />
                <NotificationSnackbar
                    message={notificationMessage}
                    type={notificationType}
                    visible={notificationVisible}
                    setVisible={this.handleNotificationSetVisible}
                />
            </NotificationContext.Provider>
        );
    }
}

const mapStateToProps = (state: TState): IProps => ({
    language: state.language.language,
});

export const App = connect(mapStateToProps)(AppImpl);
