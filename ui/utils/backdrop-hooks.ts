import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as ActionCreators from "../redux/action-creators";

export const useBackdrop = () => {
    const dispatch = useDispatch();

    return (visible: boolean) => {
        dispatch(ActionCreators.backdropSetVisible(visible));
    };
};

export const useBackdropBound = (dependency) => {
    const setVisible = useBackdrop();

    useEffect(() => {
        setVisible(dependency);
    }, [dependency]);
};
