import { useSelector } from "react-redux";
import {
    popUpMessageSelector,
    popUpStatusSelector,
    popUpVisibleSelector
} from "../selectors";

export const usePopUpMessageHook = () => {
    return useSelector(popUpMessageSelector)
}
export const usePopUpStatusHook = () => {
    return useSelector(popUpStatusSelector)
}
export const usePopUpVisibleHook = () => {
    return useSelector(popUpVisibleSelector)
}