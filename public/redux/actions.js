import {
    INCOGNITO_PARTICIPANT,
    INCOGNITO_EVENT,
    INCOGNITO_USER,
    INCOGNITO_REWARD,
    USER_PARTICIPANT,
    USER_EVENT,
    USER_PACKAGE,
    USER_REWARD,
    REMOVE_STATE,
    USER_CURR_EVENT_HOSTING,
    USER_CURR_EVENT_PLAYING,
    USER_EVENT_CREATING,
    USER_REWARD_CREATING,
    USER_UPDATE_EVENT,
    USER_UPDATE_PARTICIPANT,
    USER_UPDATE_REWARD,
    USER_UPDATE_REWARD_CREATING,
    POPUP_STATUS,
    POPUP_MESSAGE,
    POPUP_VISIBLE,
} from "./constants"
// Event player joined
export const incognitoEvent = (event) => ({
    type: INCOGNITO_EVENT,
    payload: event,
})
// User that host the event above 
export const incognitoUser = (user) => ({
    type: INCOGNITO_USER,
    payload: user,
})
// This current participant object
export const incognitoParticipant = (participant) => ({
    type: INCOGNITO_PARTICIPANT,
    payload: participant,
})
// Reward that this participant got
export const incognitoReward = (reward) => ({
    type: INCOGNITO_REWARD,
    payload: reward,
})
// remove all state of a reducer
export const removeState = () => ({
    type: REMOVE_STATE,
})
// All events from user
export const userEvent = (event) => ({
    type: USER_EVENT,
    payload: event,
})
// User object that logged in
export const userPackage = (user) => ({
    type: USER_PACKAGE,
    payload: user,
})
// All participants that link to all event user above create
export const userParticipant = (participant) => ({
    type: USER_PARTICIPANT,
    payload: participant,
})
// All rewards that link to all event user above create
export const userReward = (reward) => ({
    type: USER_REWARD,
    payload: reward,
})
// Event this user is creating
export const userEventCreating = (event) => ({
    type: USER_EVENT_CREATING,
    payload: event,
})
// Event this user is hosting
export const userCurrentEventHosting = (event) => ({
    type: USER_CURR_EVENT_HOSTING,
    payload: event,
})
// Event this user is playing
export const userCurrentEventPlaying = (event) => ({
    type: USER_CURR_EVENT_PLAYING,
    payload: event,
})
// Reward this user is creating through event
export const userRewardCreating = (reward) => ({
    type: USER_REWARD_CREATING,
    payload: reward,
})
// Update event in redux arr that like time,...
export const userUpdateEvent = (event) => ({
    type: USER_UPDATE_EVENT,
    payload: event,
})
// Update participant joined or count ....
export const userUpdateParticipant = (participant) => ({
    type: USER_UPDATE_PARTICIPANT,
    payload: participant,
})
// Update edited reward through creating event
export const userUpdateReward = (reward) => ({
    type: USER_UPDATE_REWARD,
    payload: reward,
})
// Parallel to above
export const userUpdateRewardCreating = (reward) => ({
    type: USER_UPDATE_REWARD_CREATING,
    payload: reward,
})
export const popUpMessage = (message) => ({
    type: POPUP_MESSAGE,
    payload: message,
})
export const popUpStatus = (status) => ({
    type: POPUP_STATUS,
    payload: status,
})
export const popUpVisible = (visible) => ({
    type: POPUP_VISIBLE,
    payload: visible,
})