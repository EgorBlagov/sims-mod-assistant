import { Actions } from "../actions";
import { BackdropActions } from "./actions";

interface BackdropState {
    visible: boolean;
}

const defaultBackdropState: BackdropState = {
    visible: false,
};

export const backdrop = (state = defaultBackdropState, action: BackdropActions): BackdropState => {
    switch (action.type) {
        case Actions.BACKDROP_SET_VISIBLE:
            return {
                ...state,
                visible: action.visible,
            };
        default:
            return state;
    }
};
