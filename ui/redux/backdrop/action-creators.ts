import { Actions } from "../actions";
import { BackdropSetVisibleAction } from "./actions";

export const backdropSetVisible = (visible: boolean): BackdropSetVisibleAction => ({
    type: Actions.BACKDROP_SET_VISIBLE,
    visible,
});
