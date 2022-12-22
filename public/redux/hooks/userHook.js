import { useSelector } from "react-redux";
import {
    userCurrentEventHostingSelector,
    userCurrentEventPlayingSelector,
    userEventSelector,
    userPackageSelector,
    userParticipantSelector,
    userRewardSelector,
    userEventCreatingSelector,
    userRewardCreatingSelector
} from "../selectors";
// All event from user
export const useUserEventHook = () => {
    return useSelector(userEventSelector);
}
// Current user object 
export const useUserPackageHook = () => {
    return useSelector(userPackageSelector);
}
// All participant from events this user had or hosted
export const useUserParticipantHook = () => {
    return useSelector(userParticipantSelector);
}
// All reward from events this user had or hosted
export const useUserRewardHook = () => {
    return useSelector(userRewardSelector);
}
// Event that this user host
export const useUserCurrEventHostingHook = () => {
    return useSelector(userCurrentEventHostingSelector);
}
// Event that this user join
export const useUserCurrEventPlayingHook = () => {
    return useSelector(userCurrentEventPlayingSelector);
}
// Event that this user is creating
export const useUserCurrEventCreatingHook = () => {
    return useSelector(userEventCreatingSelector);
}
// Rewards that this user is creating
export const useUserCurrRewardCreatingHook = () => {
    return useSelector(userRewardCreatingSelector);
}