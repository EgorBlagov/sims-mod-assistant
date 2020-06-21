import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { App } from "./components/App";
import "./fonts/index.css";
import * as ActionCreators from "./redux/action-creators";
import { store } from "./redux/store";

const mountPoint = document.getElementById("root");

store
    .dispatch(ActionCreators.settingsLoadLanguage())
    .then(() => {
        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            mountPoint,
        );
    })
    .catch((err) => {
        ReactDOM.render(<div>Application loading error: {err.toString()}</div>, mountPoint);
    });
