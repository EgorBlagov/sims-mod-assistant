import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ipc } from "../../common/ipc";
import { Language } from "../../common/l10n";
import { TState } from "../redux/reducers";
import { createNotificationApiFromDispatch } from "../utils/notifications";
import "./common.css";
import { Main } from "./Main";
import { NotificationSnackbar } from "./NotificationSnackbar";

interface IPropsFromState {
    language: Language;
}

interface IPropsFromDispatch {
    dispatch: Dispatch;
}

interface IProps extends IPropsFromState, IPropsFromDispatch {}

class AppImpl extends React.Component<IProps> {
    componentDidUpdate(prevProps: IProps) {
        if (prevProps.language !== this.props.language) {
            ipc.renderer.rpc.setLanguage(this.props.language).catch((err) => {
                createNotificationApiFromDispatch(this.props.dispatch).showError(err);
            });
        }
    }

    render() {
        return (
            <>
                <Main />
                <NotificationSnackbar />
            </>
        );
    }
}

const mapStateToProps = (state: TState): IPropsFromState => ({
    language: state.language.language,
});

const mapDispatchToProps = (dispatch: Dispatch): IPropsFromDispatch => ({
    dispatch,
});

export const App = connect(mapStateToProps, mapDispatchToProps)(AppImpl);
