// tslint:disable: file-name-casing

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { App } from "./components/App";
import "./fonts/index.css";
import { store } from "./redux/store";
import { SettingsThunk } from "./redux/thunk/settings";

const mountPoint = document.getElementById("root");

store
    .dispatch(SettingsThunk.loadLanguage())
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
