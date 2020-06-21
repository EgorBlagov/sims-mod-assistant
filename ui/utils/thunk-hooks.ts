import { useDispatch } from "react-redux";
import { store } from "../redux/store";

export const useThunkDispatch = () => {
    return useDispatch<typeof store.dispatch>();
};
