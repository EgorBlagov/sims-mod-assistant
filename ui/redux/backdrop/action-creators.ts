import { Actions } from "../actions";
import { BackdropSetVisibleAction } from "./actions";

const setVisible = (visible: boolean): BackdropSetVisibleAction => ({
    type: Actions.BACKDROP_SET_VISIBLE,
    visible,
});

export const BackdropActions = {
    setVisible,
};
