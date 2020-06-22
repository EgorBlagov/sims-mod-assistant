import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BackdropActions } from "../redux/backdrop/action-creators";

export const useBackdrop = () => {
    const dispatch = useDispatch();

    return (visible: boolean) => {
        dispatch(BackdropActions.setVisible(visible));
    };
};

export const useBackdropBound = (dependency) => {
    const setVisible = useBackdrop();

    useEffect(() => {
        setVisible(dependency);
    }, [dependency]);
};
