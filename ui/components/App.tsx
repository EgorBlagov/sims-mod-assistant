import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ipc } from "../../common/ipc";
import { Language } from "../../common/l10n";
import * as ActionCreators from "../redux/action-creators";
import { TState } from "../redux/reducers";
import { createNotificationApiFromDispatch } from "../utils/notifications";
import { loadSettings, saveSettings } from "../utils/settings";
import "./common.css";
import { GlobalBackdrop } from "./GlobalBackdrop";
import { Main } from "./Main";
import { NotificationSnackbar } from "./NotificationSnackbar";

interface IPropsFromState {
    language: Language;
}

interface IPropsFromDispatch {
    dispatch: Dispatch;
    setLanguage: (l: Language) => void;
}

interface IProps extends IPropsFromState, IPropsFromDispatch {}

class AppImpl extends React.Component<IProps> {
    componentDidMount() {
        loadSettings().then((data) => {
            this.props.setLanguage(data.language);
        });
    }

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.language !== this.props.language) {
            ipc.renderer.rpc.setLanguage(this.props.language).catch((err) => {
                this.getNotificationApi().showError(err);
            });

            saveSettings({ language: this.props.language }).catch((err) => {
                this.getNotificationApi().showError(err);
            });
        }
    }

    getNotificationApi = () => {
        return createNotificationApiFromDispatch(this.props.dispatch);
    };

    render() {
        return (
            <>
                <Main />
                <NotificationSnackbar />
                <GlobalBackdrop />
            </>
        );
    }
}

const mapStateToProps = (state: TState): IPropsFromState => ({
    language: state.language.language,
});

const mapDispatchToProps = (dispatch: Dispatch): IPropsFromDispatch => ({
    dispatch,
    setLanguage: (l: Language) => dispatch(ActionCreators.setLanguage(l)),
});

export const App = connect(mapStateToProps, mapDispatchToProps)(AppImpl);
