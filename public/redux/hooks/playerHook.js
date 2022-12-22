import { useSelector } from "react-redux"
import { playerEventSelector, playerParticipantSelector, playerRewardSelector, playerUserSelector } from "../selectors"
export const usePlayerEventHook = () => {
    return useSelector(playerEventSelector)
}
export const usePlayerUserHook = () => {
    return useSelector(playerUserSelector)
}
export const usePlayerParticipantHook = () => {
    return useSelector(playerParticipantSelector)
}
export const usePlayerRewardHook = () => {
    return useSelector(playerRewardSelector)
}

