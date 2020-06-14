import React from "react";
import { useDispatch } from "react-redux";
import * as ActionCreators from "../../redux/action-creators";
import { loadSettings } from "./settings";

export const useLoadSettings = (onError: (err) => void) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        loadSettings()
            .then((settings) => {
                dispatch(ActionCreators.settingsSetLanguage(settings.language));
                dispatch(ActionCreators.settingsSetSimsStudioPath(settings.studioPath));
            })
            .catch(onError);
    }, []);
};
